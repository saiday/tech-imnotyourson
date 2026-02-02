---
title: "symbolicate crash report with dSYM"
slug: "symbolicate-crash-report-with-dsym"
date: "2021-11-23T11:20:36.000Z"
description: "We can symbolicate crash reports with two options: - with straightforward - with interactive symbolicate with 0. prepare the crash report You gotta carry it...."
tags: ["iOS", "macOS", "dSYM"]
draft: false
---

We can symbolicate crash reports with two options:

- with straightforward `dwarfdump`
- with interactive `atos`

# symbolicate with `dwarfdump`

##### 0. prepare the crash report
You gotta carry it.

##### 1. prepare the dSYM file
download your bitcode-enabled app's dSYM from App Store Connect, otherwise find it on your build machine.

##### 2. verify dSYM architecture 
```
$ dwarfdump --uuid my.dSYM
```

result:
```
UUID: CEBBEDFA-2F34-3EE2-8111-95E1FFB77740 (arm64) my.dSYM/Contents/Resources/DWARF/{target}
```

our binary was build with **arm64** architecture.
##### 3.  get target offset
```
$ otool -l my.dSYM/Contents/Resources/DWARF/target
```
result:
```
...
Load command 3
      cmd LC_SEGMENT_64
  cmdsize 1992
  segname __TEXT
   vmaddr 0x0000000100000000 <---
   vmsize 0x0000000000f90000
  fileoff 10264576
 filesize 148704
  maxprot 0x00000005
 initprot 0x00000005
   nsects 24
    flags 0x0
...
```
`vmaddr` for `segname __TEXT` is the target offset within the binary we are looking for: `0x0000000100000000`

##### 4. calculate stack trace address

For instance, I wanted to symbolicate this stack trace:
```
0   target                   	       0x100e60738 0x100ca0000 + 1836856
```

the `1836856` is the binary offset within the target. (decimal format)

What we needed is apply this offset to target offset on step 3:
`0x0000000100000000` +  `0x1c0738` (1836856 convert to hex) = `0x00000001001c0738`

##### 5. symbolicate infos

```
$ dwarfdump --arch arm64 my.dSYM --lookup 0x00000001001c0738
```

result:
```
my.dSYM/Contents/Resources/DWARF/target:	file format Mach-O arm64
0x0008947e: Compile Unit: length = 0x000050c3, format = DWARF32, version = 0x0004, abbr_offset = 0x0000, addr_size = 0x08 (next unit at 0x0008e545)

0x00089489: DW_TAG_compile_unit
              DW_AT_producer	("Apple Swift version 5.3.1 (swiftlang-1200.0.41 clang-1200.0.32.8)")
              DW_AT_language	(DW_LANG_Swift)
              DW_AT_name	("{...}/{...}.swift")
              DW_AT_LLVM_sysroot	("/Applications/Xcode-12.2.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS14.2.sdk")
              DW_AT_APPLE_sdk	("iPhoneOS14.2.sdk")
              DW_AT_stmt_list	(0x00077c85)
              DW_AT_comp_dir	("{...}/target")
              DW_AT_APPLE_optimized	(true)
              DW_AT_APPLE_flags	("-private-discriminator _B08CC2D1F4AB0B323390C781AC3A21B9")
              DW_AT_APPLE_major_runtime_vers	(0x05)
              DW_AT_low_pc	(0x00000001001bbe24)
              DW_AT_ranges	(0x0004bdd0
                 [0x00000001001bbe24, 0x00000001001bff54)
                 [0x00000001001c00a4, 0x00000001001c2138)
                 [0x00000001001c214c, 0x00000001001c3708)
                 [0x00000001001c3714, 0x00000001001c3cd4)
                 [0x00000001001c3dbc, 0x00000001001c53ec)
                 [0x00000001001c54e8, 0x00000001001c5574)
                 [0x00000001001c5be4, 0x00000001001c5ca0)
                 [0x00000001001c5cd4, 0x00000001001c64a0)
                 [0x00000001001c64dc, 0x00000001001c6714)
                 [0x00000001001c6738, 0x00000001001c6844)
                 [0x00000001001c6868, 0x00000001001c68cc)
                 [0x00000001001c6930, 0x00000001001c6990)
                 [0x00000001001c69b4, 0x00000001001c69e0)
                 [0x00000001001c6a30, 0x00000001001c6a78)
                 [0x00000001001c6ad0, 0x00000001001c6af8)
                 [0x00000001001c6b70, 0x00000001001c6bac)
                 [0x00000001001c6be0, 0x00000001001c6ce4)
                 [0x00000001001c6d20, 0x00000001001c6d98)
                 [0x00000001001c6e08, 0x00000001001c6e6c)
                 [0x00000001001c6ea0, 0x00000001001c6ea8))

0x0008b3f0:   DW_TAG_inlined_subroutine
                DW_AT_abstract_origin	(0x0008b3af "Swift runtime failure: Unexpectedly found nil while implicitly unwrapping an Optional value")
                DW_AT_low_pc	(0x00000001001c0738)
                DW_AT_high_pc	(0x00000001001c073c)
                DW_AT_call_file	("{...}/{...}.swift")
                DW_AT_call_line	(379)
                DW_AT_call_column	(0x13)
Line info: file '/{...}/{...}.swift', line 0, column 0, start line 0
```

# symbolicate with `atos`

##### 0. prepare the crash report
You gotta carry it.

##### 1. prepare the dSYM file
download your bitcode-enabled app's dSYM from App Store Connect, otherwise find it on your build machine.

##### 2. verify dSYM architecture 
```
$ dwarfdump --uuid my.dSYM
```

result:
```
UUID: CEBBEDFA-2F34-3EE2-8111-95E1FFB77740 (arm64) my.dSYM/Contents/Resources/DWARF/{target}
```

our binary was build with **arm64** architecture.
##### 3.  find target binary offset
in your crash report, search for **Binary Images:**

```
...
Binary Images:
====
       0x100ca0000 -        0x101c2ffff my.bundle.id (4.0.3) <cebbedfa-2f34-3ee2-8111-95e1ffb77740> /Volumes/VOLUME/*/{...}.app/target
====
       0x1ba324000 -        0x1bba17fff com.apple.UIKitCore (1.0) <21e9f29f-240d-3476-8b43-cdd466037e71> /System/iOSSupport/System/Library/PrivateFrameworks/UIKitCore.framework/Versions/A/UIKitCore
       0x1a5621000 -        0x1a56b8fff com.apple.FrontBoardServices (764) <7a9af884-64d3-3563-880c-62dc35276c14> /System/Library/PrivateFrameworks/FrontBoardServices.framework/Versions/A/FrontBoardServices
...
```

`0x100ca0000` is our target offset within the binary

##### 4. setup `atos`
```
$ atos -arch arm64 -o my.dSYM/Contents/Resources/DWARF/target -l 0x100ca0000
```
atos now enters an interactive mode, reading addresses from stdin.

##### 5. symbolicate infos
Finding your crash report's stack trace address.
stack trace:
```
0   streetvoice                   	       0x100e60738 0x100ca0000 + 1836856
```
`0x100e60738` is the address I can feed into atos.

submit `0x100e60738` in atos interactive mode.

result:
```
closure #1 in {...}.viewWillTransition(to:with:) (in target) ({...}.swift:0)
```

you can then type other stack trace address.
