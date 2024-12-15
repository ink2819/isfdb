# Exploring AI Image Classification with Pulp Magazine Covers from ISFDB

## Project Description
**currently experiencing some issues with displaying cover images hosted from [philsp.com](http://www.philsp.com/) on the site. When I tested locally the images displayed just fine. If this issue isn't fixed soon, I will host all the images elsewhere and re-link them to the page since i already have them downloaded**

This project explores how different AI vision models classify visual information using pulp magazine cover art from speculative fiction pulp magazines (mostly 1920s–1950s). The interactive website of this project allows users to view data visualizations of generated tags from image-classification or captioning models such as google/vit-base-patch16-224, SmilingWolf/wd-v1-4-vit-tagger-v2. By comparing these tags between models and to the actual cover art content, users can observe the models’ inaccuracies, biases, and limitations.

Additionally, the copy-writing explainations on the website also provides some insights into the contextual influences shaping each model. I paid attention to explaining how training data and creators’ positionality shape the model outputs.

### By-product: a dataset for *Sisters of Tomorrow*
Building on the research of Lisa Yaszek in *Sisters of Tomorrow*, a broader dataset was also created as part of this project. It includes over 2364 entries of publication information from 27 women artists and authors in the golden age of pulp science fiction, filtered specifically for works with documented cover images.

---

## Rationale Statement
My three objectives:
- Critique the interpretive limitations and biases in AI vision models, making the argument that characteristics of the training data and the positionality of its creators are amplified in every aspect of the model’s output. Using AI as a tool for visual analysis can reveal surprisingly little about the data while exposing much more about the models themselves.

- Provide a tool for anybody to learn more about how AI vision models 'understand' visual content in a direct, intuitive, and interactive way. Through comparison and specific examples of phrase-image pairings, a potential user can get a feel of the relationship between a given model's classification data and visual attributes through exploration.
- An experimentation to combine cultural heritage data, web-scrapting, AI, information experience design and data visualization in practice to help us better understand a topic.


### A word on the data 
This project uses a specific dataset with intention: pulp magazine covers in association with early women writers and cover artists in science fiction, as indexed by Lisa Yaszek's book, *Sisters of Tomorrow*. The genre of pulp fiction is also known for being overtly sexual and sexist, many featuring sex, violence, exploitative and racially problematic themes. However, among these artifacts lies a hidden movement of women artists and writers who subtly pushed against traditional norms through their contributions to pulp magazines. Female writers and artists in speculative fiction also used the creative freedom from pulp to create work that incorporated feminist perspectives deemed subversive at the time. 

The pulp magazine cover art of speculative fiction from this dataset offers a fascinating snapshot of this mix of constraint and rebellion, which makes it an interesting subject to test the AI vision models for my project purpose. The images are suggestive and 'problematic' enough to reveal the models' different treatment and flaws when dealing with complex and questionable themes in visual content. The lurid nature of pulp also allows me to do so without having to run problematic tagger models on photographs of real people or sourcing out-right explicit images. 

On the other hand, the history and contributions of women in sci-fi pulp magazines offer an optimistic counterpoint to the grim critique of AI. The popularization of pulp was a product of technological advancement: the availability of cheap and easy printing on pulp paper. Just as these women used Sci-Fi to imagine better futures and used the contradictory genere of pulp fiction to push forward these narratives, we can draw inspiration from their legacy to push for transformative narratives through AI. Despite the flaws and unsettling aspects of how AI is built, the works of women in early Sci-Fi and pulp remind me of the potential to repurpose imperfect systems as tools for creativity and progress.

---

## Workflow
1. **Initial Data Collection:**
   - I manually compiled a list of 27 artists and authors from the book *Sisters of Tomorrow* and sourced their information pages on the Internet Speculative Fiction Database (ISFDB).
   - Then, I scraped the publication information and cover image links for each of the author/artist from ISFDB using Beautiful Soup in three steps:
     - Author/artist pages → Titles → Cover images(to filter for publications that have documented cover images) → Publication info.
     - From the cover images' hyperlinks, I was able to get the internal publication IDs to access XML publication info via ISFDB's API.
   - I then organized publication info into a dataset called[`sisters_of_tomorrow_publications`]() using pandas, creating a separate CSV called [`pulp_publications1`]()of 576 entries, filtering for pulp magazine publications with cover images.

2. **Generating Tags for Images:**
   - I processed cover images using the [`google/vit-base-patch16-224`](https://huggingface.co/SmilingWolf/wd-v1-4-vit-tagger-v2) [`microsoft/resnet-50`](https://huggingface.co/microsoft/resnet-50) [`oschamp/vit-artworkclassifier`](https://huggingface.co/oschamp/vit-artworkclassifier)models from Hugging Face using the transformers library and generated tags for each.
   - Also ran the [`wd-tagger`](https://huggingface.co/SmilingWolf/wd-v1-4-vit-tagger-v2) model (via GitHub repository [neggles/wdv3-timm](https://github.com/neggles/wdv3-timm)) to generate tags for each image. The program called for local image and could only process one at a time, so I also wrote a script to download all the images for processing and a batch processing script with python to handle local images and save outputs as CSV.
   - Then, I compiled the tag outputs from models into the publication info csv.

3. **Data Visualization and Website Development:**
   - Built site using HTML, CSS, and interations with D3.js.
   - Added additional contextual information on AI models.

---

## Further Uses
This project provides resources for additional research and applications:
- **ISFDB data scraper** The Python notebooks can be reused to scrape publication data by author. But you will need to provide a starting list of author page links.
- **Feminist Science Fiction data:** The dataset on 27 women artists and authors can be used for further research into female writers and artists' contributions to speculative fiction.
- **Switch out or add more models:** You can potentially clone the site and dataset and add more models to test additional AI models or refine existing analyses with new data visualizations.

---

## Files List
1. **isfdb.ipynb**  
   python notebook. webscraping isfdb, data cleaning, running data transformers library.

2. **sisters_of_tomorrow_publications.csv**  
   CSV containing publication information for 27 authors and artists, filtered for publications that has documented coverimages.

3. **batch_script.py**  
   Python script to process images in bulk with the wd14-tagger.

4. **pulp_publications1.csv**  
   In-process data file, same content as sisters_of_tomorrow_publications.csv.

5. **pulp_publications2.csv**  
   Data used for this project, containing only PULP publications of for 27 authors and artists and image captions by [`google/vit-base-patch16-224`](https://huggingface.co/SmilingWolf/wd-v1-4-vit-tagger-v2) [`microsoft/resnet-50`](https://huggingface.co/microsoft/resnet-50), [`oschamp/vit-artworkclassifier`](https://huggingface.co/oschamp/vit-artworkclassifier) and [`wd-tagger`](https://huggingface.co/SmilingWolf/wd-v1-4-vit-tagger-v2) models.


5. **Website Files**  
   - **index.html**
   - **style.css**
   - **visualizations.js**: D3.js script for interactive visualizations.

---
## AI usage acknowldgement

- [`google/vit-base-patch16-224`](https://huggingface.co/SmilingWolf/wd-v1-4-vit-tagger-v2), [`microsoft/resnet-50`](https://huggingface.co/microsoft/resnet-50), [`oschamp/vit-artworkclassifier`](https://huggingface.co/oschamp/vit-artworkclassifier), [`wd-tagger`](https://huggingface.co/SmilingWolf/wd-v1-4-vit-tagger-v2) are used for image classification or captioning.
- [`ChatGPT4o`](https://chatgpt.com/) was used to debug D3.js and CSS issues, walk me through how to write the batch processing script for wd-tagger, taught me how to do the cute `tag` thing in markdown, and helped me generate the hyperlink formating in markdown syntax because I was too lazy to do it manually.

---

## References

- This project was created as part of the course [Programming Cultural Heritage](https://gofilipa.github.io/info-664-fall24/intro.html) By Filipa Calado @ Pratt Institute School of Information

- Gallo, M. A., Lefanu, S., & Yaszek, L. (Eds.). *Sisters of Tomorrow: The First Women of Science Fiction*. Wesleyan University Press. [LINK](https://www.weslpress.org/9780819576248/sisters-of-tomorrow/)

- University of Connecticut. "Feminism and the Golden Age of Science Fiction Pulp." [LINK](https://benton.uconn.edu/feminism-and-the-golden-age-of-science-fiction-pulp/#:~:text=The%20covers%20portrayed%20narrow%20ideas,both%20adversaries%20and%20unlikely%20allies.)

- Brundage, M., & Yaszek, L. (Ed.). *The Heads of Cerberus and Other Stories*. MIT Press. [LINK](https://mitpress.mit.edu/9780262549066/the-heads-of-cerberus-and-other-stories/)

- AI Vision Models: 
   - [`google/vit-base-patch16-224`](https://huggingface.co/SmilingWolf/wd-v1-4-vit-tagger-v2), 
   - [`microsoft/resnet-50`](https://huggingface.co/microsoft/resnet-50), 
   - [`oschamp/vit-artworkclassifier`](https://huggingface.co/oschamp/vit-artworkclassifier), 
   - [`wd-tagger`](https://huggingface.co/SmilingWolf/wd-v1-4-vit-tagger-v2)


- Internet Speculative Fiction Database. [WEBSITE](https://www.isfdb.org/)

