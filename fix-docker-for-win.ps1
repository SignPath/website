# Use this if you experience problems with thw Windows Firewall or file access permissions in Docker for Windows.
# You might have to execute this after reboots.
Set-NetConnectionProfile -interfacealias "vEthernet (DockerNAT)" -NetworkCategory Private