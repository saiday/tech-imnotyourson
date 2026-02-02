---
title: "Treat TODO: and FIXME: as warnings in Swift project"
slug: "treat-todo-and-fixme-as-warnings-in-swift-project"
date: "2016-07-31T17:16:13.000Z"
description: "Create a new in your target's If your code needs commenting, it isn’t clear enough, but TODO: and FIXME: is the exception. Happy codeing."
tags: ["TODO:", "FIXME:"]
draft: false
---

Create a new `Run Script Phase` in your target's `Build Phase`

```bash
TAGS="TODO:|FIXME:"
echo "searching ${SRCROOT} for ${TAGS}"
find "${SRCROOT}" \( -name "*.swift" \) -print0 | xargs -0 egrep --with-filename --line-number --only-matching "($TAGS).*\$" | perl -p -e "s/($TAGS)/ warning: \$1/"
```

If your code needs commenting, it isn’t clear enough, but TODO: and FIXME: is the exception.

Happy codeing.
