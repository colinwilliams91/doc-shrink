# Doc-Shrink

## Logo
![[doc_shrink_logo_06.png]]

## Document Editor Software
_this is what we will extend?_
- _First:_ WebApp
- `LibreOffice` Extension?
	- open source... so... *how can I use their internal APIs...?*
- Desktop App?
    - _First:_ Electron App?
- CLI

## About
> Doc-Shrink is a tool designed to optimize and reduce the size of documentation files. It helps in minimizing the storage space required for documentation while maintaining the essential information.

***Features***:
- use a model trained on thousands (maybe more) of current job descriptions for SWE (software engineers; possibly extended to other professions in the future)
  - HuggingFace Transformers? (or some other open-source model architecture)
    - Alternatively "Resume" Datasets on HuggingFace
  - with this model the technology will analyze the contents of the end user's resume and make the bullet points hyper succinct and concise, with a high accuracy regarding word omission based on popular trends in tech and skills that are considered high-value.
- the ability to re-arrange the document file's contents (the text, tables, paragraphs, ordered/unordered lists, etc.) visually to optimize document real estate.
- reducing the word count of the resume to between 350 - 550, aiming for the lower part of the range without sacrificing quality and reasonable legibility.
- creating a strong visual "flow" of the resume by understanding recruiter trends such as reading diagonally and scanning (it has been reported that recruiters read resumes in under 30 seconds)
- *more to come!*...

> The technology will not be centered around creating or modifying end user's resume's actual content--just abbreviating, shortening, moving visual elements around, etc; to maximize the efficient usage of space.
