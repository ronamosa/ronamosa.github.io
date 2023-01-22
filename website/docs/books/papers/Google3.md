---
title: Google Monorepo Paper
---

:::info

My reading and notes of the Google Paper: ["Why Google Stores Billions of Lines of Code in a Single Repository"](https://dl.acm.org/doi/pdf/10.1145/2854146) by Authors Rachel Potvin & Josh Levenberg.

Youtube Version: [here](https://www.youtube.com/watch?v=W71BTkUbdqE)

:::

## Notes

### Key Details

* Google uses a custom Version Control System (VCS) called Piper & CitC
* Piper distributed across 10 x Data Centres around the world
* Piper is used by 95% of Google Developers situated around the globe
* Developers use "trunk-based" development at Google
* Lot of custom tooling and practices by Google to enable effective use of Monolithic Repo
* Google codebase size = 1B files, 86TB of data including 35 millions commits across 18 years.

### Piper

Google tried looking for a commercial solution for their VCS needs, but couldn't find one so built Piper.

All the code commits, 25,000 SE's around the world commiting typically 16,000 changes, 24,000 changes by way of automated systems.

Single large repo on top of Google infra, first [Big table](https://static.googleusercontent.com/media/research.google.com/en//archive/bigtable-osdi06.pdf)

:::info Big Table

"Bigtable is a distributed storage system for managing structured data that is designed to scale to a very large size: petabytes of data across thousands of commodity
servers. "

:::

now [Spanner](https://research.google/pubs/pub39966/)

:::info Google Spanner

"Spanner is Google's scalable, multi-version, globally-distributed, and synchronously-replicated database. It is the first system to distribute data at global scale and support externally-consistent distributed transactions."

:::

Piper = dist. over 10 x Google Data Centre's use [Paxos algorithm](https://en.wikipedia.org/wiki/Paxos_(computer_science)) for consistency across replicas.

:::info Paxos Algorithm

_Paxos is a family of protocols for solving consensus in a network of unreliable or fallible processors. Consensus is the process of agreeing on one result among a group of participants. This problem becomes difficult when the participants or their communications may experience failures.[1]_- Wiki

:::

Interesting reference in Googles ["Site Reliability Engineering"](https://sre.google/sre-book/managing-critical-state/) _"Chapter 23 - Managing Critical State: Distributed Consensus for Reliability"_ to Paxos Algorithm as SRE would be super interested and invested in distributed systems consistency.

:::tip System Architecture Patterns

Also check out [System Architecture Patterns for Distributed Consensus](https://sre.google/sre-book/managing-critical-state/) in the Google SRE book.

:::

Architected for high level of redundancy and optimize latency across 10 x Data Centres

### Clients in the Cloud (CitC)

* CitC is how developers access Piper (VCS)
* CitC is a "cloud-based storage backend + Linux-only FUSE file system"
* Developers see their workspaces as directories in the file system, and can use normal Unix tools to browse, view edit files without needing to create a local state copy of the files.
* Workspace is "in the cloud", so change location change machine, developers work state persists independently.
* all "writes" stored as CitC 'snapshots', so can roll back any writes.
* Developers see their local changes "overlaid on top" of the full Piper repo
* Developers can navigate and edit files across whole codebase

### Tools for Code

A bunch of tools were developed to help Google do monolithic repo at the scale it does, so would be advisable to look at the same if you were to go this route.

## Trunk-based Development

Developers work at 'HEAD' (most recent version of code) and the copy or clone is called the "trunk" or main. Difference? Branch-based developement more prone to merge conflicts due to long-lived branches clashing when they finally come back to "main". Trunk has a single consistent view, always and frequently coming back to "main". "Branch-based" unusual and not supported at Google.

Release branches = cut from specific versions of the repo and usually a snapshot of HEAD to maintain stability.
Bug fixes = developed on main.

### Feature Flags

old & new code exist behind feature flags (mainly project-specific code, not library code), avoids need for "developement" branches and easier to toggle things. Also think 'A/B' testing via flags, which Google uses using flags.

### Workflow Best Practices

CICD i.e. automated testing after almost every commit, to rebuild all affected dependencies. If a change breaks too much stuff, system auto removes it. Google "presubmit" infrastructure does CI and automated testing _before_ that code is added to the codebase.

ALL code is reviewed before commit, so there's a little culture pressure there to "not commit bad code". Theme here "dont commit bad code" - how to avoid? Code reviews & code ownership.

Code ownership = every directory in the monolith has code ownership of that directory, so they control who can commit code to their codebase/directory. How does it typically work? 1 x code review from a Developer from that codebase and 1 x commit approval from the "code owner" of that directory/codebase.

> _"Google has developed a number of practices and tools to support its enormous monolithic codebase, including trunk-based development, the distributed source-code repository Piper, the workspace client CitC, and workflow-support-tools, Critique, CodeSearch, Tricorder, and Rosie."_

## Advantages

1. one source of truth i.e. unified versioning (see ["Diamond Dependency Problem"](https://jlbp.dev/what-is-a-diamond-dependency-conflict))
2. code sharing & re-use - i.e. cos its all in one repo, tools, libraries can be found, shared easily
3. atomic changes - i.e. developer knows they can change one thing in "the" repo, and it's changed for ALL e.g. depdendencies etc.
4. large-scale refactoring
5. flexible team boundaries, code ownership i.e. because all in one repo, boundaries and code ownership is marked by directories
6. code visibility, clear tree structure, means implicit team namespacing.

## Trade-offs

Main costs to this model are:

1. tooling investment for dev work and operational work, as the code scales, so does investment in developing and maintaining these tools
2. codebase complexity e.g. dependency issues, code discovery difficulty
3. investment in "code health"

notes on codebase complexity - investments in code search, tools like "grep" get bogged down (discovery) as codebase scales. argument that developers searching and finding other tools and API's to use is good for code re-use, but also creates over dependency (or too easy to add deps) of existing code vs thinking-out your own code or API design, make retro code clean up messier/error-prone.

devs need to be aware of their dependency graphs, and unnecessary deps can lead to downstream build breaks.

### Documentation

This was super interesting:

```text
The fact that most Google code is
available to all Google developers has
led to a culture where some teams ex-
pect other developers to read their
code rather than providing them with
separate user documentation.
```

the classic "just read the code", the advantage for the anti-documentation engineer was "no effort required for writing & maintaining docs", but one aspect I have never considered was this...

```text
but devel-
opers sometimes read more than the
API code and end up relying on under-
lying implementation details. This be-
havior can create a maintenance bur-
den for teams that then have trouble
deprecating features they never meant
to expose to users
```

Where the external team, bases their work on the _underlying_ implementation of your code/API, and now your team can't mess with that to move your own code off somewhere else, because the external team is dependent on that which locks you in as well!

### Code Health

lots of tools to maintain code health that auto removes dead code, splits up large refactors, auto-assigns code reviews. but sounds like there's a big human toll of managing this clean up and health work for the code, including simple refactoring that need eyeballs and reviews because its codebase-wide.

## Conclusion

Basically, while it can be done:

```text
At Google, we have found, with some
investment, the monolithic model of
source management can scale success-
fully to a codebase with more than one
billion files, 35 million commits, and
thousands of users around the globe. 
```

doesn't mean its for everyone

```text
The monolithic model of source
code management is not for everyone.
It is best suited to organizations like
Google, with an open and collabora-
tive culture. It would not work well
for organizations where large parts
of the codebase are private or hidden
between groups.
```
