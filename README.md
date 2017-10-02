# Zetkin Organize, organize.zetk.in
Zetkin Organize is the Zetkin interface for organizers. Zetkin is a platform
for organizing activism.

Zetkin is developed by the Zetkin Foundation and friends. If you want to learn
more about Zetkin or help out with development, you can find more information
at [the Zetkin Foundation website](http://www.zetkin.org) or
[The Zetkin Manual](http://manual.zetkin.org).

## Getting started
To get started with development you need [Docker](https://www.docker.com).
Install Docker for your platform before proceeding.

First clone the repository. Make sure that you include the git submodules by
including the `--recursive` flag.

```bash
$ git clone --recursive https://github.com/zetkin/organize.zetk.in.git
```

If you have already cloned the repository without `--recursive`, you can achieve
the same effect manually. You also need to do this after every new pull.

```bash
$ git submodule init
$ git submodule update
```

Once you have cloned the repository, build the Docker image:

```bash
$ ./bin/build_dev
```

Docker will download all the requirements and create an image which you can
then use to run Zetkin Organize on your local port 80.

```bash
$ ./bin/run_dev
```

The development version contains build scripts, component hot loading and
other features to ease development.

Edit your hosts file (e.g. `/etc/hosts`) to contain a line that maps
www.dev.zetkin.org to your localhost.

```
127.0.0.1       organize.dev.zetkin.org
```

This ensures that you can sign in to your local version of the portal using the
development version of the Zetkin Platform API (api.dev.zetkin.org). Just point
your browser to organize.dev.zetkin.org, which is now your local version, and
start using it. Edit javascript code and components will be reloaded instantly
in your browser.

__NOTE__: SCSS files are not hot reloaded. You must reload the page, or install
a browser extension to reload just the CSS files, to see changes after editing
SCSS.
