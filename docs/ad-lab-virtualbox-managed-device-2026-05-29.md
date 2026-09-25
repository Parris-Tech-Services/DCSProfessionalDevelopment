# AD Lab / VirtualBox on a Managed School Device

Date captured: 2026-09-25
Original conversation date: 2026-05-29

## Prompt/context

Josh asked whether installing/running VirtualBox on his DCS computer to test Active Directory in a virtual machine was a good idea, a bad idea, or mixed.

A VirtualBox installer log was attached in the chat. The raw log is **not included here** because this repository is public and the log may contain school/device/user/environment details that should not be published.

## Answer given

The answer was: **mixed, leaning not ideal on a managed DCS work laptop unless Paul/ICT explicitly approves it.**

For learning and professional development, an isolated Active Directory lab in a VM is useful. It is a good way to practise Windows Server, AD DS, DNS, domain joins, Group Policy, and admin workflows without touching production systems.

For a managed school computer, it introduces extra risk because VirtualBox is not just a normal user app. It installs system-level components such as drivers and virtual networking pieces, and an AD lab can accidentally interfere with a real school network if misconfigured.

## Practical recommendation

Do not run an AD lab on the DCS network without explicit approval.

Safer options:

1. Prefer a personal laptop, spare machine, or completely separate lab device.
2. If approved for the DCS computer, use only **Host-only** or **Internal Network** networking.
3. Do **not** use bridged networking on the school LAN.
4. Do **not** join lab machines to the real DCS domain.
5. Use a clearly fake lab domain such as `lab.local`, `joshlab.test`, or similar.
6. Keep DHCP, DNS, domain controller services, and Group Policy fully isolated from production.
7. Document the setup clearly so another ICT person can understand what is installed and why.

## Suggested message to Paul/ICT

> I was thinking of using VirtualBox to build an isolated AD lab for learning. I’d keep it host-only/internal network only, not bridged to the DCS network, and not connected to the real domain. Are you comfortable with that being on my DCS laptop, or would you prefer I keep it on a personal device?

## Key takeaway

This is a good professional-development idea, but the safe default is: **learn AD in an isolated lab, not on the production school network, and not on a managed school device unless approved.**
