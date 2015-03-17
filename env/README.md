# Dev/deploy environments
The Zetkin project uses [Docker](https://docker.com) to set up development and
production environments. This sub-tree contains the content and configuration
of these environments.

## Get started
Before you can do anything you need to install Docker (and, if you're not on
Linux, Boot2Docker as well). Follow the download and install instructions for
your platform on [docker.com](https://docs.docker.com/installation).

Once you have installed Docker, just run the shell script `./up.sh` from this
directory to build and launch the container. This might take some time on the
first run, but the necessary downloads will be cached for future runs.

```
$ ./up.sh
building zetkin-od
[...]
starting zetkin-od
[...]
```

This launches the `zetkin-od` container and starts serving from port 8000 on the
host of the docker daemon, usually localhost on Linux, or the IP adress returned
by `boot2docker ip` on other systems.

## Reloading during development
If you are modifying the code, you need to restart the API service to force
reload the server to load the new code. The easiest way to do this is to use
`docker exec` to interact with the Runit service within the `zetkin-od`
container:

```
docker exec api sv restart organizer-dashboard
```

A nice way to set this up so that the organizer dashboard service is restarted
when code changes is to use the `watchmedo` tool, which is part of the
[watchdog](https://pypi.python.org/pypi/watchdog) Python package. The following
command, when issued in the root repository folder, will listen for changes to
python files and issue the restart signal whenever a JS or JSX file is saved.

```
watchmedo shell-command -c "docker exec api sv restart organizer-dashboard" \
  -p "*.js;*.jsx" -R -W zetkin
```

Of course, any other watcher will do as well.

## If you're on Windows
Getting everything to work on Windows is slightly more cumbersome. In essence,
what you need to do is the same as on any other system, but there are a number
of tiny, invisible obstacles along the way which you need to overcome.

Given that you have already installed Boot2Docker and a Git client, proceed to
perform the following steps.

### Step 0: Prepare Git for correct line endings
This is obstacle number one, which we might as well get out of the way before
we proceed.

The default Git behavior on Windows is to convert line endings to CRLF (which
is a Windows-only thing) on checkout, and then convert back to UNIX-style LF
newlines when checking in. This is usually fine, but not in our case since we
need to be able to run the checked-out files in a Linux VM.

Configure your Git client to not touch line endings. If you are using any kind
of command-line Git, run this:

```
git config --global core.autocrlf false
```

If you don't want this to be global, you can do the next step first, then change
the local config within the newly cloned repository using `git config` without
the `--global` flag, delete everything in the repository except the .git folder
and check it back out.

### Step 1: Clone repository
The next step is to clone the repository if you haven't already. Depending on
what Git client you use, this might be done through some GUI, or by issuing the
`git clone` command, using either SSH or HTTPS (SSH is nicer but requires more
set up).

```
git clone https://github.com/zetkin/organizer-dashboard.git
```

**NOTE**: Make sure you clone the repository to somewhere in your User folder.
Everything will be simpler if you clone the repo to your User folder.

### Step 2: Run Boot2Docker
When you installed Boot2Docker, it would have created a shortcut called
"Boot2Docker Start" somewhere, usually on your desktop. Run it to launch a shell
within the Boot2Docker VirtualBox VM.

### Step 3: Find the env folder
Navigate to the env folder of the repository. Your User directory will have been
mounted automatically at /c, so if your local repository is at
`C:\Users\YourName\Documents\organizer-dashboard` or similar you can navigate to it
using:

```
cd /c/Users/YourName/Documents/organizer-dashboard/env
```

If you have your development folders elsewhere you will need to add them as
Shared Folders in VirtualBox and then mount them inside the VM. Open the newly
installed *Oracle VM Virtual Box*, it should be in your start menu. Right click
the `boot2docker-vm` in the list and choose Settings. The easiest option is to
change the `/c/Users` entry to point to a different path **without changing its
folder name**. This sidesteps the need for a new mounting command.

[Adding additional folders is possible, but slightly complicated.](https://github.com/boot2docker/boot2docker#virtualbox-guest-additions)

If your VM is running when you make these changes you may need to restart it
before they are applied.

### Step 4: Run Docker containers
From here you should simply be able to run the `up.sh` script which builds the
Docker images and runs the necessary containers. You might have to run it with
the sh shell explicitly:

```
sh up.sh
```

Downloading the requirements, building the images and starting the containers
might take some time.

### Step 5: Verify set-up
Once everything is up and running, test the set-up by navigating to the IP
address of your Boot2Docker VM on port 8000. You can find the IP by running
`boot2docker.exe ip` in your standard Windows CMD shell.

```
boot2docker.exe ip
192.168.59.103
```

Use the IP address and navigate to http://192.168.59.103:8000. Your browser
should be able to connect and will be served whatever the current build of the
Organizer Dashboard returns at the root URI.

## Why not Docker Compose?
The `up.sh` script basically mimics a subset of the Compose tool which is part
of the Docker project. Compose doesn't work on Windows though, not even in the
Boot2Docker VM. The `up.sh` script is a compromise while we wait for Compose to
be properly implemented on Windows.
