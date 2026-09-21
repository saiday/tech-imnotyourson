---
title: "A Late 2014 Mac mini will not idle on Linux until its unused controllers sleep"
slug: "mac-mini-linux-idle-power"
date: "2026-09-21T10:00:00.000Z"
description: "Haswell-ULT goes down to PC10. On Debian 13 this Mac mini never got past PC3, because two controllers nothing uses sit in D0 and hold their PCIe links up. Release them and the package reaches every state it has: 2.394 W to 0.666 W."
tags: ["linux", "mac-mini"]
draft: false
---

Every Late 2014 Mac mini has a [Haswell-ULT dual core](https://www.intel.com/content/dam/support/us/en/documents/processors/CustomerSupportServicing-MobileProcessors.pdf), the low-power variant Intel built the deep idle states into. On Debian 13 mine reached none of them, so it never delivered the idle power the chip was designed for.

Where the package spent its time instead:

| | PC2 | PC3 | PC6 | PC7 | PC8 | PC9 | PC10 |
|---|---|---|---|---|---|---|---|
| **residency** | 12.73% | 77.22% | 0.00% | 0.00% | 0.00% | 0.00% | 0.00% |

> A package C-state is how deeply the whole CPU package is asleep: a higher number means more of it is switched off and less power drawn. PC2 and PC3 are shallow and save little. The saving starts at PC6, where core voltage is removed, and deepens through PC7 to PC10.

## An awake controller keeps the package out of its deep states

Two controllers on this machine stay awake with nothing to be awake for, and each one sets a different ceiling.

**Thunderbolt sets the PC3 floor.** Nothing has ever been plugged into either port, and the controller at 06:00.0 is awake anyway. An awake device keeps every PCIe bridge above it awake too, so the whole chain follows it up to the root port:

```
00:1c.4  PCIe root port          active
  04:00.0  bridge                active
    05:00.0  bridge              active
      06:00.0  Thunderbolt NHI   active
```

The package cannot reach a deep C-state while any PCIe link is up. However idle the machine gets, it stops at PC3.

**The Wi-Fi card caps it at PC7.** The Broadcom BCM4360 at 02:00.0 holds root port 00:1c.2 awake the same way. Release Thunderbolt alone and the package reaches PC7 and stops there. PC8 and below need almost everything on the platform out of D0.

Neither driver is missing runtime PM. [`drivers/thunderbolt/nhi.c`](https://github.com/torvalds/linux/blob/v6.12/drivers/thunderbolt/nhi.c) configures the controller to autosuspend and on this machine it simply never does. I did not find what holds it awake, and I do not have to: there is no Thunderbolt device here and this box is on ethernet, so both can go.

That also answers a [2016 LKML report](https://lkml.iu.edu/hypermail/linux/kernel/1602.1/03982.html) nobody replied to, asking why a Mac mini's idle draw only drops after a suspend-to-RAM cycle. Suspend puts the controller through D3 and the driver never pulls it back up.

## The fix

```bash
# Two steps per device: the unbind drops the driver reference,
# power/control is what lets it descend.

# Thunderbolt. Nothing has ever been attached to either port.
echo 0000:06:00.0 > /sys/bus/pci/drivers/thunderbolt/unbind
echo auto > /sys/bus/pci/devices/0000:06:00.0/power/control

# Wi-Fi. This box reaches the network over ethernet only.
echo "blacklist wl" > /etc/modprobe.d/blacklist-wl.conf
rmmod wl
echo auto > /sys/bus/pci/devices/0000:02:00.0/power/control

# SD card reader.
echo 0000:03:00.1 > /sys/bus/pci/drivers/sdhci-pci/unbind
echo auto > /sys/bus/pci/devices/0000:03:00.1/power/control

# Management Engine interface. A Mac does not use AMT.
echo 0000:00:16.0 > /sys/bus/pci/drivers/mei_me/unbind
echo auto > /sys/bus/pci/devices/0000:00:16.0/power/control

# Built-in IR receiver, for an Apple Remote this box does not have.
# It was the only thing keeping xHCI awake.
echo auto > /sys/bus/usb/devices/1-4/power/control
echo auto > /sys/bus/pci/devices/0000:00:14.0/power/control

# Arm PME, or suspending xHCI silently kills USB hotplug.
echo enabled > /sys/bus/usb/devices/usb1/power/wakeup
echo enabled > /sys/bus/usb/devices/usb2/power/wakeup
```

Writes to `/sys` do not persist, so all of it is gone at the next boot. Save the commands above as `/usr/local/sbin/power-tune.sh` and run it from a oneshot unit, enabled with `systemctl enable --now power-tune`:

```ini
[Unit]
Description=Idle power tuning
After=multi-user.target

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/local/sbin/power-tune.sh

[Install]
WantedBy=multi-user.target
```

## Do we lose any device functionality?

Mini DisplayPort output, the SD card slot, the Apple IR remote and Wi-Fi all stop working. My server is headless and drives an HDMI monitor only when I need one, so none of that matters.

## Tuning comparison

Six paired runs on a headless machine, arm order randomised within each block, CPU and disk load matched across both arms:

| | untuned | tuned |
|---|---|---|
| **package power** | 2.394 W | 0.666 W |
| **CPU temperature** | 43.3 °C | 41.4 °C |
| **time in PC7 or deeper** | 0.00% | 86.6% |

## Do we now idle as low as macOS?

Under macOS, `powermetrics` puts this Late 2014 Mac mini's idle package power between **0.5 W and 1.5 W**.  
It sits at 0.666 W now. (Untuned Debian sat at 2.394 W, well outside that.)

