# Tech post content style

How posts read. Mechanics (frontmatter, images, drafts, deploy) live in `creating-posts.md`.

## The reader

A peer, mid-problem, who already knows the platform. They found the post by searching the error they
are staring at. They have not got time for your introduction, and they do not need the framework
explained to them.

So: the first sentence is their symptom, their goal, or your verdict. The post ends when the last
instruction ends.

## Only write what you hit

Every post is a receipt for something that actually happened at the keyboard. That is the whole
authority behind it, and it sets the boundaries:

- Claims carry the version they were true on. Behavior belongs to `Xcode 26.3`, `Kotlin 1.2.40`,
  `Android N`, not to the platform in general.
- Measurements, not adjectives. `3.059s to 0.072s`. `1.8G per directory`. `20 markdown files`.
- Terminal output, error strings, and source lines are pasted as they came, because that is what the
  reader searched for and what proves the claim.
- What you did not figure out gets said plainly. "I have no clue, but not using the buffer from
  `asReadOnlyBuffer()` works fine" is a finished post. Guessing to sound complete is not.
- When a later post makes an older one wrong, the older one says so and links forward.

## Give the mechanism, not just the incantation

A workaround the reader cannot reason about is worth little. Say why the thing breaks, so they can
predict when the fix stops working: the destination resolver has no buildable arch; `actool` drops
malformed entries without erroring; the Kotlin compiler is invoked before javac and resolves packages
more strictly.

One sentence of mechanism beats three paragraphs of steps.

## Have an opinion, and pay for it

Recommend, and name what you are recommending against. Talk the reader out of things when they should
be talked out, including out of the post's own topic. Disagree with Apple, Google, Gradle, or a
vendor SDK by name when they have wasted your afternoon, and attach the evidence in the same breath:
the source line, the doc paragraph, the bug report. Bluntness without the receipt is just noise.

No hedging the opinion back to safety afterwards. If it depends on something, name the condition
instead.

## No performance

Nothing in the post exists to make the author look good.

- No marketing adjectives, least of all for your own work.
- No narrating the debugging journey in sequence. Lead with the cause. A dead end is mentioned only
  when it saves the reader from walking down it.
- No "Hope this helps", "Let's dive in", "As we all know", no apology for the post being short or for
  the gap since the last one.
- Short posts ship. A paragraph and a snippet is a post. So is a note to yourself.

## Code carries the weight

Prose explains; code is the answer. Fenced blocks with a language tag, only the lines that matter,
the rest elided with `...`. Commands copy-paste and run as written. A comment inside a snippet says
why that line is there, or it is deleted.

Never a placeholder like `// do X here`. Never a Gist embed or a screenshot of code.

## Credit and quote

Link inline on the meaningful phrase. Name the Stack Overflow answer, blog post, or person the
solution came from. Quote official docs or source when it settles the question, then say in your own
sentence what it means, because a quote never gets the last word.

## Punctuation

No em dashes. Use a comma, a colon, a period, or rewrite the sentence.
