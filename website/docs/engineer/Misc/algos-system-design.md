---
title: "Algorithms for Systems Design"
---

:::info Reference

watching the folks at [ByteByteGo](https://www.youtube.com/watch?v=xbgzl2maQUU&ab_channel=ByteByteGo) video and making notes.

:::

Be aware of these algorithms and their relevance to systems design.

## Consistent Hashing

- Clock Analogy: numbers are servers/nodes, data are points on the face, closest server to the data is the relationship. server/node changes, data reference to closest server/node changes.
- Balances load within "cluster of services".

## GeoHash

- Location based services.
- "hashes" geophraphic locations into strings that are easier to reference.
- analogy: cut world map in 32 chunks, pick a chunk, cut it up into 32 more, repeat until you have the granularity you want. each chunk is a level e.g. first cut is 1-32, so chunk 27, split 32 times again and picking chunk 10 would create the geohash 27-10 etc.

## Quadtree

- great for representing spatial information i.e. 2D objects, or images.
- useful for collision detection or spatial indexing and location based services.
- similar to geohash but you divide by 4 (quads)
- differs from geohash in that you analyze each quad, if quad is uniform (e.g. all one color, no diffs) leave it, if its mixed you divide that quad into 4 again.
- repeat the process to create a "tree" where each node has a quad (mixed and divided) or none (uniform).
- to read this, the analogy of finding a specific scene in a movie by first the chapter, then the scene, then the frame.
- efficient storage and quick access, as a system, because it ignores the "nothing" frames and logs the frames with action in them.
- decreases the search scope.

## Leaky Bucket & Token Bucket

- Rate limiter
- specifically for networking.
- makes me think of [Thinking in Systems](/docs/books/reading-list) talking about reserves and rates of ebb and flow of things moving between things.
- the bucket represents the "buffer", holds the overflow, faces the bursts
- the leak in the bucket is the steady, stream to the system, constant rate.
- overflow is "lost" think dropped packets.
- creates a constant flow from a varying flow, smoothing out traffic.

## Trie

- pronounced "try".
- tree-like structure, stores dynamic sets of strings.
- Search Autocomplete
- moves down the tree depending on node it's looking for e.g. if we're trying to spell "BAD", it would scan and find B, move to that node, then find A, move, then D etc.
- analogy: bookshelf
  - similar to the other tree-like structures, we have a shelf per letter, get a book e.g. "thinking in systems", we put it on the "T" shelf, then the "H" sub-shelf of the "T" shelf, and on and on until we get to the 's' in "systems".
  - if we have another book title "Thinking fast thinking slow" this would share the same Trie as "Thinking in systems" as far as the "thinking" part of the title.
  - this saves space by sharing common prefixes.

## Bloom Filter

- Quickly check if an element exists.

## Raft/Paxos

these algo's are really about ensuring a distributed system ALL AGREE on the value of a particular piece of data. e.g. etcd is a distributed key-value store that uses Raft to manage a highly available replicated log.

- a "consensus algorithm"
- elect a leader, ensure followers or members can raise ideas and put it to leader, leader puts it to a vote (a vote e.g. raft in etcd, is majority member nodes actually writing that log thereby "voting" or agreeing").
- leader brings any nodes that fall behind or are out of sync.
