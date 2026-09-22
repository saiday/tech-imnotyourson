---
title: "Find the failing addresses in bad RAM and reserve them out of Linux with memmap"
slug: "reserve-bad-ram-linux-memmap"
date: "2026-09-22T12:00:00.000Z"
description: "Bun blamed itself, docker blamed its shared libraries, containerd blamed its symbol table. It was one byte of DRAM, 42 MiB wide, soldered to the board. memtest= confirms it, MemTest86 locates it, memmap= takes it out of the allocator."
tags: ["linux", "mac-mini"]
draft: false
---

I have a Late 2014 Mac mini (soldered RAM) running Debian 13, and I got three runtimes each confidently blaming itself:

```
panic(main thread): Segmentation fault at address 0x8
oh no: Bun has crashed. This indicates a bug in Bun, not your code.

docker: error while loading shared libraries: unexpected reloc type 0x00003008

containerd: fatal error: bad symbol table
```

The final diagnosis is bad RAM. Finding out exactly which addresses are bad and reserving them in the OS was my only way to keep this machine in service.

## Is it the disk, or is it the memory?

These two can look identical, except that a disk that corrupts your data keeps a record of it, and RAM does not.

So check the disk first. `smartctl -A` prints the attribute table, and `smartctl -l error` prints the ATA error log.

Mine reported zero on both, which is only half an answer. It rules the disk out, it does not rule the memory in. For that, run a whole-system integrity check twice and compare the two results:

```bash
sudo dpkg -V > /tmp/verify.1
sudo dpkg -V > /tmp/verify.2
diff /tmp/verify.1 /tmp/verify.2
```

`dpkg -V` re-hashes every file and prints the ones whose hash no longer matches. A healthy machine prints nothing twice. If the two lists differ, the thing that changed was never on the disk, it was the copy the kernel made in RAM on the way to hashing it.

Mine printed a different set of files nearly every run. So it is the RAM.

## Which addresses are bad

Linux will test memory for you before it hands any of it out. Add `memtest=N` to the kernel command line. It runs in early boot, before the page allocator exists, so it can touch almost all of physical memory instead of the fraction that happens to be free later.

```
early_memtest: # of tests: 13
Bad RAM detected. Use memtest86+ to perform a thorough test
WARNING: CPU: 0 PID: 0 at mm/memtest.c:35 reserve_bad_mem+0x32/0x80
  7777777777777777 bad mem addr 0x00000001bcf1e250 - 0x00000001bcf1e258 reserved
  7777777777777777 bad mem addr 0x00000001bcf962d0 - 0x00000001bcf962d8 reserved
  9999999999999999 bad mem addr 0x00000001bcf1e390 - 0x00000001bcf1e398 reserved
  9999999999999999 bad mem addr 0x00000001bcf96310 - 0x00000001bcf96318 reserved
```

The long number on the left is the pattern that was written, and `reserved` means the kernel has already taken those eight bytes out of circulation for this boot. That settles it.

Boot [MemTest86](https://www.memtest86.com/) for a comprehensive diagnosis. Mine ran for 2.5 hours over three full passes and covered every byte of RAM. Three lines of its summary are the ones that matter:

```
Lowest Error Address  : 0x1BCF1E250  (7119 MB)
Highest Error Address : 0x1BF9F6C50  (7161 MB)
Bits in Error Mask    : 000000000000FF00
```

The first two give you a 42 MiB window instead of the kernel's half a megabyte. The third is the one worth understanding: `000000000000FF00` is bits 8 through 15 of the 64-bit word, which is **one byte, in the same position, every single time**. Out of 484 individually logged error records there was not one exception. That is not a scattering of weak cells across the module, it is one physical part of it failing, and it means a contiguous reservation will actually cover the problem.

> Use PassMark's MemTest86 instead of memtest86+: when the run finishes, it writes its report back to the USB drive it booted from. You get a file for your AI agent to read, whereas memtest86+ does not.
>
> MemTest86 found errors the kernel's own test missed on the same hardware, because it ran longer, with more patterns, on a hotter machine ([Thermal Issues in DRAM](https://siliconvlsi.com/thermal-issues-in-dram/)).

## Taking the range away from Linux

One line in `/etc/default/grub`:

```bash
# single quotes, one backslash
GRUB_CMDLINE_LINUX='memmap=128M\$0x1bc000000'
```

Then `sudo update-grub` and reboot.

The parameter is `memmap=<size>$<start>`: how much to take, then where it starts, in hex. It marks the range reserved in the e820 map (the table of physical memory the kernel builds before it has an allocator).

The two numbers come from the MemTest86 summary, which prints MiB and labels it MB:

| | in the report | what I used |
|---|---|---|
| start | lowest error address, 7119 MB | 7104 MiB, or `0x1bc000000` |
| end | highest error address, 7161 MB | 7232 MiB |
| size | 42 MiB of damage between them | 128 MiB |

The start is rounded down to a clean hex boundary, 15 MiB below the lowest failure, because a round number is easier to check by eye afterwards. The size is the part that needs justifying: 64 MiB would have covered everything MemTest86 saw.

What decides it is the 32 MiB period. Two base addresses, each failing again exactly 32 MiB higher:

| | MiB |
|---|---|
| `0x1BCF1E000` | 7119 |
| `0x1BD9F6000` | 7129 |
| `0x1BEF1E000` | 7151, or 7119 + 32 |
| `0x1BF9F6000` | 7161, or 7129 + 32 |

The period is an observed pattern, so covering two more turns of it is my cheap bet. It cost me 128 MiB out of 8 GB, 1.64% of the machine's RAM.

## Checking the reservation took

Validate that the reservation took effect.

```
$ cat /proc/cmdline
BOOT_IMAGE=/boot/vmlinuz-6.12.107+deb13-amd64 root=UUID=... ro memmap=128M$0x1bc000000 quiet

$ sudo grep 1bc000000 /proc/iomem
1bc000000-1c3ffffff : Reserved

$ grep MemTotal /proc/meminfo
MemTotal:        7880588 kB
```

One more boot with `memtest=13` is worth it as a final check:

```
$ journalctl -k -b | grep -iE 'memtest|bad mem addr'
Sep 22 00:32:18 debian kernel: early_memtest: # of tests: 13
```

`early_memtest` walks free memory, and the reserved range is no longer free. What it says is that the other 7.8 GB passed.

