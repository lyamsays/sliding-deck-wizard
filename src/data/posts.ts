export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

export const posts: Post[] = [
  {
    slug: "professor-slide-time",
    title: "Why Professors Spend 4 Hours a Week on Slides (And How to Get That Time Back)",
    excerpt: "A survey of 200 educators found the average professor spends between 3-5 hours per week creating and updating presentation materials. Here's the breakdown — and what to do about it.",
    date: "April 8, 2026",
    readTime: "5 min read",
    category: "Educator Productivity",
    content: `Every semester, the same ritual plays out in faculty offices across the country. A professor opens PowerPoint on Sunday night, pulls up last year's lecture notes, and begins the slow work of turning them into slides. Three hours later, they have 20 slides that are fine — not great, just fine.

Multiply that by one lecture per week, across a 15-week semester, and you've spent 45+ hours on slide design alone. That's more than a full work week, every semester, just formatting bullets and adjusting font sizes.

## Where the Time Actually Goes

A breakdown of the typical slide creation process for a 75-minute lecture:

**Finding and updating content (45 min)** — Pulling from last year's notes, adding new research, removing outdated examples. This is the only part that actually requires your expertise.

**Formatting and layout (60 min)** — Deciding where things go on the slide, adjusting font sizes, making sure nothing looks visually terrible. Pure busywork.

**Creating speaker notes (30 min)** — Often skipped entirely, even though notes are what make a deck useful for teaching rather than just display.

**Export and file management (15 min)** — Saving to the right folder, uploading to the LMS, converting to PDF for students.

The first 45 minutes is irreplaceable. The other two and a half hours largely aren't.

## What Changes When AI Handles the Layout

The shift isn't about removing you from the process — your content knowledge, your sense of what students need, your pedagogical instincts can't be automated. What can be automated is the translation of that expertise into structured slides.

When you paste lecture notes into an AI presentation tool, the system does the work of deciding: this is a key point, this belongs as a bullet, this should be in the speaker notes, this needs its own slide. The structure that takes you 90 minutes emerges in 30 seconds.

What you're left with is the review and refinement pass — 15-20 minutes of checking that the AI captured your intent correctly, adjusting the emphasis on certain points, adding a specific example from your own research that no AI could know.

## The Speaker Notes Problem

Most professors don't write speaker notes. Not because they don't see the value, but because there's no time left after building the slides themselves.

This is a significant loss. Notes are where the teaching actually lives — the transition between slides, the question to ask the class before revealing the answer, the story that makes an abstract concept land. Slides without notes are outlines; slides with notes are lessons.

AI-generated speaker notes, at minimum, prompt you to think about what should accompany each slide. Even if you rewrite them entirely, the cognitive overhead of starting from a blank page is gone.

## Getting Time Back in Practice

The realistic outcome of using an AI slide tool isn't 90% time savings. It's more like 60-70% — with the remaining time going to review, customization, and the occasional wholesale rewrite of a section the AI misread.

That still returns 2+ hours per lecture to research, student interaction, or simply rest. Over a semester, it's the equivalent of recovering an extra week of faculty time.

The professors who get the most out of these tools are the ones who treat the AI output as a strong first draft rather than a finished product — exactly the same standard they'd apply to a research assistant who did the initial formatting work.`
  },
  {
    slug: "testing-effect-slides",
    title: "The Testing Effect: Why Your Slides Should Generate Discussion, Not Just Transfer Information",
    excerpt: "Cognitive science research consistently shows that retrieval practice beats passive re-reading. Here's how to design slides that force active recall — and why your speaker notes matter more than your bullets.",
    date: "April 3, 2026",
    readTime: "7 min read",
    category: "Teaching & Learning",
    content: `In 2006, Roediger and Karpicke published what became one of the most replicated findings in educational psychology: students who were tested on material retained significantly more than students who re-studied the same material for the same amount of time. Not a little more — dramatically more. In some conditions, retrieval practice produced twice the long-term retention.

The testing effect has held up across dozens of replications, different subject matters, different age groups, and different types of material. It is one of the most robust findings in the science of learning.

It also has almost no visible influence on how most professors design their lecture slides.

## What Passive Slides Look Like

The default slide is an information delivery vehicle. A topic sentence, three to five bullets, maybe an image. The professor presents; students receive. Notes get taken. The information moves from the slide to a notebook and, in many cases, nowhere else.

This format optimizes for coverage, not retention. A professor can get through a lot of content in 75 minutes with well-organized bullet-point slides. What the research suggests is that covering content and students retaining content are genuinely different outcomes — and passive slides reliably produce the first without guaranteeing the second.

## Designing for Retrieval

Retrieval-oriented slide design doesn't require abandoning structured content. It requires building in friction — moments where students have to actively pull information from memory rather than passively receive it.

**The answer-before-reveal structure.** Present a question or problem on one slide. Give students 60 seconds to think or discuss. Then advance to the answer. This can be built into any lecture at the transition points between topics.

**Sparse slides, rich notes.** Reduce the information density on the slide itself, putting the full explanation in speaker notes you deliver verbally. Students who have to reconstruct what they heard engage more actively with the material.

**Cumulative callbacks.** Include a brief reference to a concept from a previous lecture at the start of each new section. "We talked last week about working memory limits — how does that connect to what we're seeing here?" This is low-overhead retrieval practice with no additional slides required.

**Exit questions.** Replace the summary slide with a question students haven't seen before that can be answered using what was covered. Even if ungraded, the act of attempting it consolidates the session's content.

## Why Speaker Notes Are the Underused Lever

Most of the retrieval-oriented techniques above live in the presentation rather than in the slide itself. They require knowing, at each moment in the deck, what question to ask, what to withhold, when to pause.

This is precisely what well-crafted speaker notes provide. Notes that say "ask students to explain the mechanism before showing the diagram" or "pause here — most students confuse these two concepts" turn a set of static slides into a dynamic teaching instrument.

AI tools can generate notes that reflect general pedagogical principles. They won't know that your class consistently struggles with a particular concept, or that a specific metaphor works better for your students. But they provide a structured starting point that's significantly better than nothing — and editing is faster than creating from scratch.`
  },
  {
    slug: "behind-sliding-io",
    title: "Behind Sliding.io: How I Built an AI Presentation Tool for Professors in Law School",
    excerpt: "I'm a first-year law student at BU who graduated from Cornell last year. This is the story of why I built Sliding.io, what I got wrong the first three times, and what the product looks like today.",
    date: "March 28, 2026",
    readTime: "8 min read",
    category: "Company",
    content: `The idea came from a conversation, not a startup idea generator.

I was a senior at Cornell, sitting in a professor's office hours, and she mentioned — almost as an aside — that she'd spent the previous weekend rebuilding a slide deck she'd given six times before because the department wanted a "refreshed" version for an accreditation review. Not new content. New formatting. Eight hours of her weekend, gone.

I started building.

## What I Got Wrong the First Time

The first version of Sliding.io was essentially a generic AI slide generator with an educator label slapped on it. You typed a topic, it made slides. The slides were fine. They were also exactly the kind of generic content a professor would never use — no audience specificity, no speaker notes, no connection to actual lecture materials.

The feedback from the three professors who tried it was polite and damning: "This would be useful if I were starting from scratch, but I never am. I have notes. I need to turn my notes into slides."

That reframe changed everything. The product isn't a slide generator. It's a notes-to-slides converter. The source material is the professor's own content — their expertise, their research, their pedagogical approach. The AI's job is to structure and format that content, not to replace it.

## The Second Problem: Audience Specificity

The second version handled document upload. You could paste lecture notes or drop in a PDF and get a deck back. Better. But professors kept noting that the same material needs to be presented differently to a room of undergraduates versus a graduate seminar versus a department colloquium.

A lecture on memory consolidation for an intro psychology class needs different vocabulary, different examples, and different depth than the same topic for a doctoral proseminar. Generic slides don't solve this problem.

So we added role and audience settings. You tell Sliding.io who you are (professor, TA, lecturer) and who you're speaking to (undergraduates, graduate students, medical students, K-12). The AI calibrates. The vocabulary changes. The examples shift. The density adjusts.

## Building in Law School

I started BU Law in the fall. The product was at a working prototype stage — functional, but rough. Law school actually made the product better. I was surrounded by people who teach and think about how to teach — how to structure arguments, how to build from precedent, how to guide students through complex material.

The speaker notes we generate aren't transcripts. They're pedagogical cues: when to pause, what question to ask before revealing the answer, how to connect this slide to the previous concept. That framing came directly from watching professors teach, including my own.

## Where It Stands Today

Sliding.io can take a PDF of lecture notes and produce a structured, themed slide deck with speaker notes in under 60 seconds. The decks are designed for actual classroom use — present mode, keyboard navigation, speaker notes panel. Export to PowerPoint with notes embedded, or share a link directly.

The free plan covers three decks per month at up to 8 slides each. Educator Pro removes limits and adds document upload, up to 15 slides, and shareable links.

That professor who spent her weekend reformatting? She was one of the first people I sent it to.`
  },
  {
    slug: "spaced-repetition-lectures",
    title: "Spaced Repetition, Forgetting Curves, and What They Mean for Lecture Design",
    excerpt: "Ebbinghaus showed we forget 70% of new information within 24 hours. The implications for how professors structure lectures — and the slides within them — are significant and underappreciated.",
    date: "March 20, 2026",
    readTime: "6 min read",
    category: "Teaching & Learning",
    content: `Hermann Ebbinghaus spent years memorizing and testing himself on meaningless syllable sequences to understand how memory works. His 1885 finding — that retention drops sharply in the hours after learning and then levels off — remains one of the most reproduced results in psychology.

The forgetting curve shows roughly 70% of new information lost within 24 hours of a single exposure. Within a week, without any reinforcement, the number climbs to 90%.

## The Spacing Effect in a Single Lecture

Most 75-minute lectures are designed as linear progressions: topic A, then topic B, then topic C. This makes organizational sense. What it doesn't do particularly well is fight forgetting.

The spacing effect — the finding that distributing practice across time improves retention more than massing it — can be applied within a lecture as well as across lectures. Rather than covering topic A completely before moving on, a lecture can introduce A, move to B, return to A in a new context, introduce C, then synthesize all three together.

This interleaving approach is harder to design and initially feels less "clean" than linear progression. The evidence consistently shows it produces better long-term retention, even when students find it more difficult in the moment — what researchers call "desirable difficulty."

## Practical Adjustments for Existing Lectures

**Add a "From last time" slide.** Even a single question that requires students to recall content from the previous lecture activates the spacing effect. It doesn't need to be graded — the act of trying to retrieve is what matters.

**Build in a mid-lecture pause.** Around the 35-40 minute mark, stop forward progress and ask students to reconstruct, in pairs or in writing, what they've covered so far. This costs 5 minutes and produces measurable retention benefits.

**End with a question, not a summary.** Replace the final summary slide with an application question — something that requires using what was learned rather than just recognizing it. This converts the summary moment into a retrieval moment.

**Create a recurring concept thread.** Identify two or three concepts that run through your entire course and reference them explicitly in each lecture deck, even when they're not the main topic. The cumulative retrieval adds up significantly over a semester.

## The Speaker Notes Connection

The spaced repetition adjustments above all require execution in the room — knowing when to pause, what question to ask, how to connect back to earlier material. This is the layer that lives in speaker notes.

Well-designed notes flag the callback moments: "This connects to the memory consolidation discussion from week 3 — ask students to make the link before explaining it." They prompt the mid-lecture pause: "Stop here. Ask students what they think the key mechanism is before showing the next slide."

The research on spaced repetition has been available for over a century. The gap has always been in translating it into the moment-by-moment decisions of an actual lecture. Speaker notes are the mechanism for closing that gap.`
  },
  {
    slug: "ai-slides-psychology-professors",
    title: "AI Presentation Tools for Psychology Professors: What Works and What Doesn't",
    excerpt: "Psychology courses cover everything from behavioral neuroscience to clinical theory. Here's how AI slide tools handle the full range — and where human judgment still has to step in.",
    date: "March 15, 2026",
    readTime: "6 min read",
    category: "Subject Guides",
    content: `Psychology is one of the more challenging subjects for AI slide generation, and also one where the tools provide the most value. The challenge: psychology courses span an enormous range — from dense neuroscience content with precise technical vocabulary to conceptual discussions of therapy models where nuance matters enormously. The value: psychology professors typically generate rich research-based content every week that needs efficient structuring.

## Where AI Slide Tools Excel for Psych Courses

**Research methods and statistics lectures.** This content is highly structured — study design, measures, findings, implications. AI tools handle this format well, producing clear slide progressions from research paper abstracts and methods sections.

**Historical and theoretical overviews.** Survey content covering multiple theorists or schools of thought (behaviorism, psychodynamic approaches, humanistic psychology) translates cleanly into comparative slides. The AI identifies key figures, core claims, and contrasting positions from lecture notes.

**Introductory course content.** Intro psych covers broad territory rapidly. AI-generated slides handle this breadth well, particularly when you set the audience to "introductory undergraduate" and have the vocabulary calibrate accordingly.

## Where Human Judgment Matters More

**Clinical content and case studies.** Slides about specific disorders, treatment approaches, or clinical populations require careful framing. AI tools may generate technically accurate content that lacks the contextual sensitivity important for clinical education.

**Cutting-edge research.** AI knowledge has a cutoff date. Recent findings — particularly in computational neuroscience, psychopharmacology, or replication crisis discussions — need human verification.

**Culturally specific content.** Psychology has a well-documented WEIRD bias (Western, Educated, Industrialized, Rich, Democratic). AI tools reflect their training data. Professors teaching cross-cultural psychology should review AI-generated content carefully for cultural assumptions.

## A Practical Workflow

The most effective approach is using AI slides as a first draft, then reviewing with your expertise:

1. Paste your lecture notes, including citations for key empirical claims
2. Set the audience level — this makes a significant difference between intro and graduate output
3. Review the generated deck for accuracy, then add specific examples from your own research
4. Expand speaker notes with the discussion questions you know work with your particular students

The AI handles the formatting burden; you handle the disciplinary judgment.`
  },
  {
    slug: "lecture-notes-to-slides",
    title: "How to Turn Lecture Notes Into Slides Without Losing Your Mind",
    excerpt: "Most professors have excellent notes and mediocre slides. The translation problem is real — here's a systematic approach to converting your written content into a presentation that actually teaches.",
    date: "March 10, 2026",
    readTime: "5 min read",
    category: "Educator Productivity",
    content: `The problem isn't usually content. Most professors who've taught a course more than once have rich, well-developed notes — detailed explanations, key examples, the specific moments where students typically struggle. The problem is translation. Notes are written to help a professor remember; slides are designed to help students learn. These are different cognitive tasks, and the gap between them is where hours disappear every week.

## Why the Translation Is Hard

Good lecture notes are often dense and non-linear. They reference things earlier in the document that need explicit setup in a slide context. They contain explanatory parentheticals that work on paper but turn into visual clutter on a slide. They have a narrative voice that doesn't translate well to bullet points.

The instinct when building slides from notes is to copy and condense. Paragraph becomes bullets; bullets become sub-bullets; the slide fills up and stops working visually. Students read the slide instead of listening, and the professor has essentially created a document that happens to display one section at a time.

## A Structural Approach

**Identify the teaching moments first.** Before touching slide software, read through your notes and mark: (1) the key claims students need to understand, (2) the evidence or examples that make those claims compelling, and (3) the moments where confusion typically arises. These three categories map to slide content, speaker notes, and discussion prompts respectively.

**One idea per slide.** The single most common structural error in lecture slide design is trying to cover too much on one slide. A slide that covers three related points is harder to remember than three slides covering one point each.

**Depth goes in the notes.** The slide shows the claim; the depth of explanation belongs in speaker notes. This creates a lean visual that students can process quickly while allowing the verbal explanation to carry the complexity.

## Where AI Helps Most

The cognitive work of identifying what belongs on slides versus what belongs in notes versus what can be cut entirely is exactly what AI tools can accelerate. When you paste lecture notes into a well-designed AI presentation tool, you're asking it to do that structural translation automatically.

The AI won't always get the hierarchy right. It won't know which of your points is the central claim and which is supporting evidence unless your notes make that clear. But it produces a structural draft that reduces the blank-page problem and gives you something to react to.

Reacting to a draft — moving things, adjusting emphasis, rewriting a note — is faster than building from scratch. The translation still requires your judgment; the AI handles the first pass.`
  },
  {
    slug: "ai-presentation-tool-law-professors",
    title: "AI Slide Tools for Law Professors: Case Briefing, Doctrinal Mapping, and Socratic Method",
    excerpt: "Law school pedagogy is built on cases, doctrine, and the Socratic method. Here's how AI presentation tools fit — and don't fit — into a law professor's teaching workflow.",
    date: "March 5, 2026",
    readTime: "7 min read",
    category: "Subject Guides",
    content: `Law school teaching presents a distinct challenge for AI slide tools. Most legal pedagogy is structured around the Socratic method — a question-and-answer dialogue that can't be fully scripted in advance. The slide, in this context, isn't an information delivery vehicle. It's more likely to be a structural scaffold: the case, the holding, the rule, the question.

That said, law professors still spend substantial time on the mechanical work of slide preparation: pulling case facts, summarizing holdings, mapping doctrinal frameworks, creating visual timelines of legal development. This is exactly where AI tools provide value.

## What Law Lecture Slides Actually Contain

A typical 1L contracts or torts class might use slides to:

- Display case names and citations for reference
- Summarize facts efficiently
- Map the elements of a rule or test
- Show the doctrinal evolution across a series of cases
- Present hypotheticals for student analysis

The Socratic discussion that fills the class period doesn't live in the slides. It lives in the professor's preparation and in-room responsiveness. But the structural scaffolding — case summaries, rule restatements, hypotheticals — can be generated efficiently from existing case materials.

## A Practical Workflow for Casebook-Based Teaching

For professors teaching from a casebook, an efficient AI workflow looks like:

1. Copy the relevant case summaries, notes, and questions from the casebook section
2. Add your own doctrinal framing and any recent cases you're adding to the unit
3. Generate slides set to "law student" audience, "formal" tone
4. Review for accuracy — AI-generated legal content requires verification
5. Add Socratic questions to speaker notes rather than slide bodies

## Where AI Falls Short for Legal Education

**Jurisdiction-specific nuance.** AI tools are trained on general legal knowledge, not the specific doctrinal emphasis of your jurisdiction or circuit.

**Cutting-edge statutory analysis.** Recent legislation may be outside the AI's training data. Always verify currency for any statutory content.

**Hypothetical design.** Good law school hypotheticals are carefully constructed to isolate specific doctrinal questions. AI-generated hypotheticals are often too broad. Write your own, then use the AI to format and contextualize them.

**The Socratic architecture.** The sequence of questions that walks students from the case to the principle to the application is the intellectual core of law teaching. This is irreplaceable professor judgment.

Think of AI slide tools as a law review comment editor rather than a co-author. They handle format, structure, and consistency; you provide the doctrinal analysis and the pedagogical sequence.`
  },
  {
    slug: "best-ai-tool-academic-presentations",
    title: "The Best AI Tools for Academic Presentations in 2026: A Professor's Comparison",
    excerpt: "Gamma, Beautiful.ai, Canva AI, and Sliding.io — four different approaches to AI-assisted slides. Here's how they compare for professors who actually teach.",
    date: "February 28, 2026",
    readTime: "8 min read",
    category: "Tool Comparisons",
    content: `The AI presentation landscape has expanded significantly. Several well-funded tools now offer AI-assisted slide generation, and the surface differences between them obscure meaningful distinctions in how they handle academic content.

For professors evaluating options, the relevant questions aren't about visual themes or export formats — they're about whether the tool understands the difference between an undergraduate survey course and a PhD seminar.

## What Makes Academic Presentations Different

Business presentations optimize for persuasion: make the case, support it, call to action. Academic lecture slides optimize for learning: introduce a concept, build complexity, generate discussion, reinforce retention.

A tool built primarily for pitch decks will produce polished slides that move quickly, but may not leave adequate space for the pedagogical scaffolding — the discussion questions, the "common misconception" callout, the connection to previous material — that makes a lecture actually work.

## Gamma

Gamma is the most widely used AI presentation tool and produces visually impressive output. It's strongest for content that benefits from narrative flow — overview lectures, guest talks, conference presentations.

Its limitations for regular course use: it generates content from scratch rather than from your materials, the default tone is business-casual rather than academic, and speaker notes are minimal.

## Beautiful.ai

Beautiful.ai focuses heavily on automated layout. You provide content; it handles visual arrangement. The results are clean and consistent. The academic limitation: it's designed around content you type into text fields, not content you're transforming from existing materials.

## Canva AI

Canva's AI features are strong for visual design. For professors who want significant visual customization and are comfortable doing their own content work, Canva is a capable choice. It's less suited to the core notes-to-slides translation problem.

## Sliding.io

Sliding.io is purpose-built for educators. Key functional differences:

**Document upload and transformation.** You paste notes or upload a PDF. The AI structures them into a deck rather than generating new content.

**Audience and role settings.** "Professor teaching undergraduates" produces different output than "Professor teaching PhD students" — vocabulary, depth, and assumed prior knowledge all adjust.

**Pedagogical speaker notes.** Notes include discussion prompts, common confusion points, and transition cues.

**Present mode.** A fullscreen presentation mode with speaker notes panel, designed for actual classroom use.

## Making the Choice

For occasional conference presentations where visual polish matters most: Gamma or Canva AI. For regular weekly lecture preparation where you're working from your own materials: Sliding.io. For professors who care deeply about visual customization: Beautiful.ai.

Most faculty would benefit from trying all four on a single lecture and comparing the outputs directly.`
  },
  {
    slug: "sliding-io-vs-gamma-educators",
    title: "Sliding.io vs Gamma for Educators: An Honest Comparison",
    excerpt: "Gamma is the most popular AI slide tool. Sliding.io is built specifically for professors. Here's a direct comparison for academic use cases.",
    date: "February 20, 2026",
    readTime: "5 min read",
    category: "Tool Comparisons",
    content: `Gamma has become the default AI presentation tool for a lot of people, and for good reason — it produces visually impressive output quickly. The question for educators is whether "impressive demo" translates to "useful teaching tool."

## What Gamma Does Well

Gamma's visual output is excellent. It has real designers who have thought carefully about layout, typography, and information hierarchy. The themes are polished and the structure is usually correct.

It's also fast for starting from scratch. If you're creating a guest lecture on a new topic, or building overview content for a conference talk, Gamma gets you to a good-looking draft quickly.

## Where It Falls Short for Regular Teaching

**It generates, not transforms.** Gamma creates content from a topic or outline. Most professors don't need slide generation — they need their existing notes and materials transformed into slides. This is a different task.

**No audience calibration.** A slide deck for intro students and one for advanced graduate students on the same topic should look meaningfully different. Gamma doesn't make this distinction.

**Thin speaker notes.** The speaker notes Gamma generates are typically brief summaries. They don't include pedagogical guidance — discussion questions, transition cues, common misconception warnings.

**Designed for business users.** The default vocabulary, examples, and framing in Gamma's output reflect a business context. Professors regularly find themselves rewriting the framing to fit an academic register.

## Where Sliding.io Takes a Different Approach

The core design decision in Sliding.io is that professors almost always have existing content and need those materials structured into a deck, not replaced by AI-generated content.

- You upload your PDF or paste your notes rather than typing a topic
- The output reflects your content, not AI-generated approximations
- Audience settings adjust vocabulary, depth, and assumed knowledge
- Speaker notes include pedagogical cues drawn from your material

The visual output isn't as polished as Gamma's. That's a real trade-off. The question is whether visual polish or content fidelity matters more for a weekly lecture.

## Which to Use When

Use Gamma when: you're creating content largely from scratch, visual presentation quality is a primary concern, you're making a conference talk rather than a regular lecture.

Use Sliding.io when: you have existing lecture materials you're transforming, you're teaching the same material to different audiences, you want speaker notes that actually help you teach.`
  },
  {
    slug: "how-to-make-lecture-slides-faster",
    title: "How to Make Lecture Slides Faster Without Sacrificing Quality",
    excerpt: "Practical techniques for cutting slide preparation time by 60% while improving the pedagogical quality of what you produce.",
    date: "February 5, 2026",
    readTime: "6 min read",
    category: "Educator Productivity",
    content: `Speed and quality are usually in tension. In slide preparation, they don't have to be — in fact, the techniques that make slide creation faster often improve quality simultaneously by forcing structural clarity and reducing the visual noise that slows students down.

## The Template Investment

The single highest-leverage investment in slide efficiency is spending two hours creating a template you'll use for the rest of your teaching career. A good template means:

- Consistent font choices that are readable at the back of a room
- A standard layout for each slide type: concept introduction, evidence/example, discussion question, summary
- A color scheme that works across projector types

Once a template exists, you're never making formatting decisions again. The cognitive load of slide creation drops significantly when the only variable is content.

## The 3-Pass Method

Rather than building slides sequentially, a three-pass approach produces better results in less time:

**Pass 1: Structure (10 minutes).** Decide how many slides the lecture needs and what each one is fundamentally about. Write a one-line label for each. Don't write any content yet.

**Pass 2: Content (30-40 minutes).** Fill in each slide with the minimal content required — the key claim, the essential supporting point, the example. Stop when you have enough.

**Pass 3: Notes (15-20 minutes).** Write speaker notes for the slides where verbal explanation is most important: complex mechanisms, common misconceptions, transition points, discussion prompts.

Total time: 55-70 minutes for most lectures.

## Using AI for the First Draft

The 3-pass method is significantly faster when pass 2 is an AI first draft rather than a blank page. If you have lecture notes, paste them into an AI tool, get a structured slide deck back, and then revise rather than create.

The revision pass for a well-generated AI draft typically takes 20-30 minutes — checking that the hierarchy is correct, adjusting emphasis, cutting slides that covered material you want to address verbally instead. This is faster than building from scratch while preserving your judgment about what matters.

## What to Cut

Most lectures have too many slides. A 75-minute lecture rarely benefits from more than 25-30 slides. When cutting, remove slides where you'd typically say "we're not going to spend much time on this." Remove slides that repeat content from other slides with slightly different framing.

Fewer, cleaner slides with better speaker notes almost always produce better lectures than comprehensive slides with thin notes.`
  },
  {
    slug: "ai-slides-history-humanities-professors",
    title: "AI Presentation Tools for Historians and Humanists: Navigating the Interpretation Problem",
    excerpt: "The humanities present a unique challenge for AI slide tools: interpretation, argument, and disciplinary voice matter as much as content coverage. Here's how to use these tools without flattening your scholarship.",
    date: "January 28, 2026",
    readTime: "6 min read",
    category: "Subject Guides",
    content: `History and the humanities have a particular sensitivity to AI tools that's worth taking seriously. The concern isn't primarily accuracy — it's voice and interpretation. A historian's lecture isn't just a delivery of facts; it's an argument, made from a particular theoretical position, shaped by specific scholarly commitments.

AI tools trained on general knowledge produce content that sounds like the middle of the scholarly spectrum, which is often exactly where individual faculty don't want to be.

## The Interpretation Problem

When an AI tool generates a slide about the causes of World War I, it will produce a reasonable synthesis of mainstream historical scholarship. It won't produce your interpretation — the emphasis you place on structural versus contingent causes, the scholarly conversation you're situating yourself within, the specific historiographical intervention you want students to understand.

The correct use of AI tools in humanities teaching is clear: you write the interpretation; the AI structures it into slides.

## What Historians Actually Need Automated

**Timeline slides.** Dates, events, sequences — the chronological scaffolding that takes time to format well and is content-neutral.

**Primary source display.** Formatting quotations from primary sources, creating context slides that situate documents, building the visual presentation of textual evidence.

**Comparative frameworks.** Side-by-side presentations of competing interpretations, historiographical schools, or analytical categories.

**Reading synthesis slides.** Summary slides pulling from secondary sources that students have read — the "what the scholarship says" framing that sets up the lecture's argument.

## Protecting Your Scholarly Voice

Write your interpretive content in your own voice — even rough notes, incomplete sentences, argument sketches. Then ask the AI to structure and format those materials into slides. The interpretation stays yours; the formatting work gets automated.

This is the same workflow a well-supervised research assistant would provide. You wouldn't ask an RA to interpret the sources; you'd ask them to pull passages, format citations, build the timeline. AI tools are equivalent in this capacity.

## Avoiding Blandness

AI-generated content in the humanities tends toward diplomatic blandness — presenting "on the one hand, on the other hand" framings that avoid taking positions. The solution is in your source material. If your notes are argumentative, a well-designed AI tool will preserve that register. Give it your argument, your voice, your interpretation — and the structural translation can happen without flattening the scholarship.`
  },
  {
    slug: "speaker-notes-better-teaching",
    title: "Why Better Speaker Notes Make Better Lectures",
    excerpt: "Most speaker notes are transcripts of the slide. The ones that actually improve teaching are something else entirely — here's what they contain and why it matters.",
    date: "January 20, 2026",
    readTime: "5 min read",
    category: "Teaching & Learning",
    content: `Ask a professor what their speaker notes look like, and the most common answer is some version of: "I don't really use them." Either the notes are empty, or they're dense transcripts that the professor then doesn't read because reading from notes in front of students is pedagogically counterproductive.

The problem isn't that speaker notes are useless. It's that most notes are written to serve the wrong purpose.

## What Notes Typically Are

The default use of speaker notes is as a memory backup. Write down the things you might forget. This produces notes that are either so comprehensive you'd never read them mid-lecture, or so sparse they don't help when you actually need them.

## What Notes Could Be

A different conception treats notes as teaching infrastructure — the layer of the deck that carries the pedagogical intelligence that doesn't belong on the slides themselves.

**Discussion triggers.** "Ask: what would have happened if X hadn't occurred? Let students respond before advancing." This isn't memory backup — it's structured interactivity you'd probably skip if improvising and running short on time.

**Common confusion alerts.** "Students frequently conflate this with the concept from Week 3. Explicitly address the distinction before moving on." This is experience crystallized — the hard-won knowledge of what this topic does to your specific students.

**Transition architecture.** "Before showing the next slide, ask students to predict what the outcome was. This is the inflection point of the lecture." Transitions are where lectures lose students; notes that flag them prevent drift.

**Connection callbacks.** "This directly contradicts the model we built in Week 2. Make sure students feel the tension rather than just filing this as new information."

## Why This Matters for Teaching Quality

Research on teaching effectiveness consistently finds that the difference between lectures students remember and those they don't isn't primarily about content — it's about the structure of the delivery. Pauses for retrieval, explicit connections to prior material, well-placed discussion questions: these are the mechanisms of learning.

Notes written as teaching infrastructure make that intentionality possible even when a class runs unexpectedly, when a discussion takes longer than planned, when you haven't slept enough to be fully sharp.

AI-generated notes from a tool like Sliding.io aren't transcripts — they include discussion prompts, transition cues, and pedagogical guidance. They won't know your students the way you do, but they provide a structured starting point far closer to teaching infrastructure than to transcript. The revision pass is faster than the writing pass.`
  },
  {
    slug: "ai-tools-graduate-seminar-teaching",
    title: "Using AI Slide Tools for Graduate Seminars: Different Stakes, Different Approach",
    excerpt: "Graduate seminars operate differently from lecture courses — discussion-driven, theoretically sophisticated, demanding. Here's how AI tools fit into this pedagogical context.",
    date: "January 12, 2026",
    readTime: "6 min read",
    category: "Teaching & Learning",
    content: `The slide deck for a graduate seminar is a different document than a lecture slide deck for undergraduates, and using AI tools to generate them requires a different set of expectations. Graduate teaching is typically discussion-driven rather than lecture-heavy; the slides serve as structural anchors for conversation rather than primary information delivery.

## How Graduate Seminar Slides Actually Work

In a typical graduate seminar, a slide deck might contain:

- Discussion questions for each week's reading
- Key terms and theoretical frameworks that anchor the discussion
- Passage citations from the readings that merit close attention
- A structural map of the argument or debate being covered
- Context slides situating the week's material within the broader course arc

What they usually don't contain: dense content coverage or the kind of scaffolding needed when students encounter material for the first time. Graduate students are expected to arrive having read; the seminar processes that reading rather than delivering it.

## Where AI Tools Help

**Discussion question generation.** Generating multiple questions from a reading, then selecting the three or four most generative, is faster with AI assistance than from scratch.

**Theoretical framework mapping.** Slides that situate a theoretical contribution within a wider intellectual landscape — who it responds to, what the stakes of the debate are — translate well from lecture notes or course reader introductions.

**Reading synthesis across a unit.** For seminars where you're bringing multiple weeks together, AI tools can help structure a coherent synthesis deck that students can use to review the intellectual arc.

## Where Faculty Judgment Is Irreplaceable

**The questions that open rather than close.** The best graduate seminar discussion questions put theorists in productive tension, surface unstated assumptions in a text, ask students to take positions on genuinely contested issues. These require deep familiarity with the material. AI tools generate questions; professors generate generative questions.

**Calibration to specific students.** Graduate seminars are small enough that you know who's in the room. No AI can calibrate to your specific twelve students.

**The theoretical voice.** Graduate teaching requires the professor to model scholarly engagement — taking positions, disagreeing with theorists, demonstrating how to read critically. This comes from your scholarship, not a slide generator.

## A Practical Approach

For graduate seminars, use AI tools to generate a structural draft of discussion questions and reading synthesis slides, then revise aggressively. The revision-to-draft ratio will be higher than for undergraduate lecture prep — you'll rewrite more, cut more, add your own theoretical framing more extensively. But the starting point is still useful, and the formatting work is still automated.`
  },
  {
    slug: "reduce-cognitive-load-lecture-slides",
    title: "Reducing Cognitive Load in Lecture Slides: What the Research Says",
    excerpt: "Cognitive load theory has clear implications for how slides should be designed. Most academic slide decks violate these principles consistently. Here's how to fix that.",
    date: "January 5, 2026",
    readTime: "7 min read",
    category: "Teaching & Learning",
    content: `John Sweller developed cognitive load theory in the 1980s to explain why some instructional designs produce learning and others produce confusion at equivalent difficulty levels. The theory distinguishes between intrinsic load (the difficulty inherent to the material), germane load (the cognitive work of actually learning), and extraneous load (the cognitive overhead created by the instructional design itself).

Extraneous load is the interesting category for slide design. It's the load you create for students that has nothing to do with the inherent difficulty of the subject matter — and most academic slide decks generate significant extraneous load without anyone intending to.

## How Academic Slides Create Unnecessary Cognitive Load

**The split-attention effect.** When students must simultaneously process information from multiple sources that need to be mentally integrated, cognitive load increases. A common academic slide violation: a complex diagram paired with explanatory text somewhere else on the slide that students have to read and reconcile while the professor is also talking.

**Redundancy.** When the same information is presented in multiple formats simultaneously — the professor says the definition aloud while the identical definition is displayed on the slide — students process redundant information rather than attending to the primary source. The redundancy effect, counterintuitively, impairs learning compared to presenting information in a single modality.

**High element interactivity without sequencing.** Some material has many elements that must be understood in relation to each other, producing inherently high intrinsic load. Presenting all elements simultaneously on one slide overwhelms working memory. The same content, sequenced across multiple slides that build progressively, reduces cognitive load significantly.

## Principles for Lower-Load Slides

**Physical integration over split attention.** When a diagram requires explanatory labels, integrate the labels directly into the diagram. When an equation requires explanation, annotate the equation directly rather than explaining in separate text.

**Spoken or written, not both.** For any given piece of information, decide whether it should be spoken or written. Avoid putting the same information in both channels simultaneously.

**Progressive revelation.** Complex processes and multi-component frameworks should be built up slide-by-slide rather than revealed in full. Students' working memory can handle the completed picture once they've built it themselves; it often can't handle it dropped on them at once.

**Strategic sparsity.** A slide that contains less information than you could fit forces students to listen and integrate actively rather than passively read. The cognitive work of connecting what they're hearing to what they're seeing is germane load — load that produces learning.

## The Speaker Notes Connection

Much of what gets overloaded onto slides belongs in speaker notes instead. The mechanism explanation that's turning a concept slide into a text wall: notes. The nuance that requires qualification: notes. The "but here's the complication" layer: notes, paired with a well-timed pause to let the initial concept settle before adding complexity.

This is why cognitive load theory and effective speaker note design point in the same direction: lean slides, rich verbal explanation, intentional sequencing.

AI tools that generate slides from lecture notes tend to produce output that's reasonable on cognitive load principles — moderate text density, clear hierarchy, main claims rather than full explanations. The notes carry the explanatory depth. The refinement pass for any AI-generated deck should include a cognitive load audit: for each slide, ask whether the amount of information presented simultaneously is manageable.`
  },
  {
    slug: "ai-slides-medical-education",
    title: "AI Presentation Tools in Medical Education: Opportunities and Guardrails",
    excerpt: "Medical school faculty face unique challenges with AI slide tools — accuracy requirements are high, content is dense, and clinical nuance matters. Here's a practical guide.",
    date: "February 12, 2026",
    readTime: "7 min read",
    category: "Subject Guides",
    content: `Medical education has unusually high stakes for slide accuracy. A faculty member teaching pharmacology who lets an AI-generated dosing error slip through has a different problem than a history professor with an incorrect date. The accuracy requirements in medicine create a legitimate reason for caution around AI tools — and also clarify exactly where they can and can't be trusted.

## The Accuracy Question

The core concern about AI-generated medical content is hallucination: the tendency of language models to produce confident, plausible-sounding information that is factually incorrect. For medical education, this risk has to be taken seriously.

The practical mitigation isn't to avoid AI tools entirely — it's to use them for structure and format while maintaining rigorous content review. AI tools are reliable at creating slide layouts, generating discussion questions, formatting reference lists, and building logical progressions from verified source material. They are not reliable as primary sources for specific clinical parameters, drug interactions, or diagnostic criteria.

A practical rule of thumb: trust AI-generated content you could verify from memory; verify anything clinical that requires you to look it up.

## Where AI Tools Provide Value in Medical Education

**Pre-clinical science courses.** Biochemistry, physiology, pathology — subjects with well-established content that changes relatively slowly — are good candidates for AI slide assistance. The structural translation from detailed notes to organized slides works well.

**Case presentation structure.** The format of clinical case presentations (chief complaint, history, physical exam, assessment, plan) is highly standardized. AI tools handle this structure reliably.

**Review sessions and summary lectures.** Synthesizing material covered across multiple previous sessions is cognitively demanding work that AI tools handle competently. A review lecture that consolidates three weeks of content can be drafted efficiently and then verified against your course materials.

## High-Risk Areas to Review Carefully

- Specific drug dosages and pediatric/geriatric adjustments
- Drug-drug interactions, contraindications, and black box warnings
- Diagnostic criteria — particularly for recent guideline updates
- Any content where a small error would have patient safety implications

For these areas, treat AI output as a draft that requires expert verification before use.

## A Workflow for Medical Faculty

1. Generate your slide structure from lecture notes and learning objectives
2. Review all clinical specifics against primary sources
3. Use AI-generated discussion questions as a starting point, adjusting for your clinical context
4. Verify that any clinical guidance in speaker notes is accurate before relying on it in the room

The efficiency gains are real even with a thorough review process. The formatting and structuring work that was taking two hours can often be done in 30 minutes with a 20-minute review pass. The net is still significantly faster than the manual alternative.`
  }
];

export const getPostBySlug = (slug: string): Post | undefined =>
  posts.find(p => p.slug === slug);
