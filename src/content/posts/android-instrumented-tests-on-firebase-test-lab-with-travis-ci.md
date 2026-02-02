---
title: "Android Instrumented Tests on Firebase Test Lab with Travis CI"
slug: "android-instrumented-tests-on-firebase-test-lab-with-travis-ci"
date: "2019-01-19T06:17:23.000Z"
description: "If Travis CI is your Continuous Integration service, running Instrumented Tests right on the Travis CI build is a bad idea. You can only use ARM emulator on..."
tags: ["TravisCI", "android", "Firebase", "Test Lab", "Firebase Test Lab"]
draft: false
---

If Travis CI is your Continuous Integration service, running Instrumented Tests right on the Travis CI build is a bad idea. You can only use ARM emulator on Travis CI, which is very slow. You might fail your tests because of Activity not launched within 45 seconds.
Not even mention you have to setup emulator environment on Travis CI build which takes extra 10 minutes.

##### Travis Build Matrix
If you had Unit Test already, use Travis CI [build matrix](https://docs.travis-ci.com/user/build-matrix/) feature is the best practice to separate unit tests and instrumented test.


```yaml
env:
    global:
        - ANDROID_TARGET=android-26
        # Firebase
        - CLOUD_PROJECT_ID=your_project_name

    matrix:
        - TEST_METHOD=UNIT
        - TEST_METHOD=INSTRUMENTED
```

I have a rake task for testing
```ruby
def test
	method = ENV["TEST_METHOD"]
	if method == "UNIT"
		puts "Unit Testing .."
		sh "./gradlew jacocoTestReport"
	elsif method == "INSTRUMENTED"
		puts "UI Testing"

		# Build
		sh "./gradlew assembleGlobalDebug assembleGlobalDebugAndroidTest -PdisablePreDex"

		# Send to firebase
		sh " bash -x send_instrumented_test_to_firebase.sh"
	else 
		puts "unsupported TEST_METHOD arg"
	end
end
```

##### Encrypt your Firebase service account for Travis CI
It's always good to protect your privileged access token. You can use Travis CLI to encrypt files and decrypt it on CI build. (see [Encryption keys](https://docs.travis-ci.com/user/encryption-keys/))

```bash
travis encrypt-file your_firebase_service_account.json
```

It then output `your_firebase_service_account.json.enc` file. Don't forget to commit this encrypted file to your git repository.

##### Send to Firebase Test lab

I have another `send_instrumented_test_to_firebase.sh` file as an isolated script for uploading APKs to Firebase, which is executed inside rake's test task.
```bash
#!/bin/bash


# Firebase service account decrypt
openssl aes-256-cbc -K $encrypted_xxxxxx_key -iv $encrypted_xxxxx_iv -in your_firebase_service_account.json.enc -out /tmp/service-account.json -d

# Firebase setup
wget --quiet --output-document=/tmp/google-cloud-sdk.tar.gz https://dl.google.com/dl/cloudsdk/channels/rapid/google-cloud-sdk.tar.gz
mkdir -p /opt
tar zxf /tmp/google-cloud-sdk.tar.gz --directory /opt
/opt/google-cloud-sdk/install.sh --quiet
source /opt/google-cloud-sdk/path.bash.inc

# Setup and configure the project
gcloud components update
echo $CLOUD_PROJECT_ID
gcloud config set project $CLOUD_PROJECT_ID

# Activate cloud credentials
gcloud auth activate-service-account --key-file /tmp/service-account.json

# List available options for logging purpose only (so that we can review available options)
gcloud firebase test android models list
gcloud firebase test android versions list

gcloud firebase test android run \
	--type instrumentation \
	--app mobile/build/outputs/apk/global/debug/mobile-global-debug.apk \
	--test mobile/build/outputs/apk/androidTest/global/debug/mobile-global-debug-androidTest.apk \
	--device model=Pixel2,version=27,locale=en,orientation=portrait  \
	--device model=NexusLowRes,version=24,locale=en,orientation=portrait
```

#### Result
On Travis CI:
![](/content/images/2019/01/Screen_Shot_2019-01-19_at_2_07_24_PM.png)

On Firebase Test Lab:
![](/content/images/2019/01/Screen-Shot-2019-01-19-at-2.09.32-PM.png)
