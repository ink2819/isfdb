let width = 800;
let height = 800;

//expanding the graph
document.getElementById("expand").addEventListener("click", () => {
    width = 1500; 
    height = 1500;
    svg.attr("width", width).attr("height", height);
    loadModel(currentModel);
});

document.getElementById("small").addEventListener("click", () => {
    width = 800; 
    height = 800;
    svg.attr("width", width).attr("height", height);
    loadModel(currentModel);
});

// Container for SVG
const svg = d3.select(".viz")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Tooltip
const tooltip = d3.select(".viz")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ccc")
    .style("padding", "10px")
    .style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)")
    .style("visibility", "hidden")
    .style("font-size", "14px")
    .style("color", "#333");

// popup for image hover
const popup = d3.select(".viz")
    .append("div")
    .attr("class", "popup")
    .style("position", "absolute")
    .style("background-color", "#0e1111")
    .style("border", "1px solid green")
    .style("padding", "15px")
    .style("box-shadow", "0px 6px 8px rgba(0, 0, 0, 0.2)")
    .style("width", "300px")
    .style("height", "350px")
    .style("visibility", "hidden")
    .style("font-size", "14px")
    .style("color", "#000");

// Model info HTML content
const modelInfo = {
    wd14: `
        <h2>Model Info</h2>
        <p>The full name of this model is 'waifu-diffusion 14 tagger'. Trained using https://github.com/SmilingWolf/JAX-CV.
            TPUs used for training kindly provided by the TRC program.
            
            <br>Dataset<br>
            Last image id: 7220105<br>
            Trained on Danbooru images with IDs modulo 0000-0899.
            Validated on images with IDs modulo 0950-0999.
            Images with less than 10 general tags were filtered out.
            Tags with less than 600 images were filtered out.</p>
        <h2>Note</h2>
        <p>Notice that this model identifies a lot of physical features and has high granularity in female body features. This is a result of its training data (tags and images) being from Danbooru, a largely NSFW image board specialized in anime fanart.</p>`,
    google_vit: `
        <h2>Model Info</h2>
        <p>The full name of this model is: google/vit-base-patch16-224. The ViT model was pretrained on ImageNet-21k, a dataset consisting of 14 million images and 21k classes, and fine-tuned on ImageNet, a dataset consisting of 1 million images and 1k classes.</p>
        <h2>Note</h2>`,
    microsoft:`
    <h2>Model Info</h2>
    <p>The full name of this model is: google/vit-base-patch16-224. The ViT model was pretrained on ImageNet-21k, a dataset consisting of 14 million images and 21k classes, and fine-tuned on ImageNet, a dataset consisting of 1 million images and 1k classes.</p>
    <h2>Note</h2>`,
    oschamp:`
    <h2>Model Info</h2>
    <p>The full name of this model is: google/vit-base-patch16-224. The ViT model was pretrained on ImageNet-21k, a dataset consisting of 14 million images and 21k classes, and fine-tuned on ImageNet, a dataset consisting of 1 million images and 1k classes.</p>
    <h2>Note</h2>`
};

// Default model is wd14
let currentModel = "wd14";

// switching up information in the .page info div
function updateModelInfo(model) {
    const infoDiv = d3.select(".pageInfo");
    infoDiv.html(modelInfo[model]); 
}

// viz
function loadModel(model) {
    d3.csv("pulp_publications2.csv").then(infoData => {
        // row[model] is whatever model is loading
        const phraseCounts = {};
        infoData.forEach(row => {
            const phrases = (row[model] || "").split(",").map(d => d.trim());
            const id = row["Record"];
            phrases.forEach(phrase => {
                if (phrase) {
                    if (!phraseCounts[phrase]) {
                        phraseCounts[phrase] = { count: 0, ids: [] };
                    }
                    phraseCounts[phrase].count++;
                    phraseCounts[phrase].ids.push(id);
                }
            });
        });

        console.log("Final phraseCounts for model:", model, phraseCounts);

      //phrase count == phrase data
        const phraseData = Object.entries(phraseCounts).map(([key, value]) => ({
            phrase: key,
            count: value.count,
            ids: value.ids
        }));

        // initiate your friendly bubble chart 
        const bubble = d3.pack()
            .size([width, height])
            .padding(5);

        const root = d3.hierarchy({ children: phraseData })
            .sum(d => d.count);

        const nodes = bubble(root).leaves();

        // Clear existing visualization
        svg.selectAll("*").remove();
      // Create a bunch of bubbles
      svg.selectAll(".bubble")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.r)
      .style("fill", "green")
      .on("mouseover", function (event, d) {
          d3.select(this).style("fill", "darkgreen").style("cursor", "pointer");

          // Show tooltip
          tooltip.style("visibility", "visible")
              .text(d.data.phrase)
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY + 10}px`);
      })
      .on("mousemove", function (event) {
          tooltip.style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY + 10}px`);
      })
      .on("mouseout", function () {
          d3.select(this).style("fill", "green");
          tooltip.style("visibility", "hidden");
      })
      .on("click", function (_, d) {
          const matchingIds = d.data.ids;
          const phrase = `The Tag is: ${d.data.phrase}`;
          const count = `(count: ${d.data.count})`;
          const baseUrl = 'https://www.isfdb.org/cgi-bin/pl.cgi?';
          const matchingImages = infoData.filter(row => matchingIds.includes(row["Record"]))
              .map(row => ({
                  link: row["Cover Image Link"],
                  sitelink: baseUrl+row["Record"],
                  title: row["Title"],
                  author: row["Author"],
                  date: row["Date"],
                  phrases_wd14: row["wd14"],
                  phrases_google: row["google_vit"],
                  phrases_microsoft: row["microsoft"],
                  phrases_oschamp: row["oschamp"]
              }));

          // Load header and images
          const infoHead = d3.select(".infoHead");
          infoHead.text(`${phrase} ${count}`);

          const infoDiv = d3.select(".covers");
          infoDiv.html("");

          matchingImages.forEach(imageData => {
              infoDiv.append("img")
                  .attr("src", imageData.link)
                  .attr("alt", "Cover Image")
                  .style("max-width", "100px")
                  .style("margin", "5px")
                  .on("mouseover", function (event) {
                      popup.html(`
                          <h3>${imageData.title}</h3>
                          <p><strong>Author:</strong> ${imageData.author}</p>
                          <p><strong>Date:</strong> ${imageData.date}</p>
                          <p><strong>wd14:</strong> ${imageData.phrases_wd14}</p>
                          <p><strong>google:</strong> ${imageData.phrases_google}</p>
                          <p><strong>microsoft:</strong> ${imageData.phrases_microsoft}</p>
                          <p><strong>oschamp:</strong> ${imageData.phrases_oschamp}</p>
                          <p><strong>oschamp:</strong> ${imageData.phrases_oschamp}</p>
                      `)
                          .style("visibility", "visible")
                          .style("color","green")
                          .style("left", `${event.pageX + 10}px`)
                          .style("top", `${event.pageY + 10}px`);
                  })
                  .on("mousemove", function (event) {
                      popup.style("left", `${event.pageX + 10}px`)
                          .style("top", `${event.pageY + 10}px`);
                  })
                  .on("mouseout", function () {
                      popup.style("visibility", "hidden");
                  })
                  .on("click", function () {
                      window.open(imageData.sitelink, "_blank");
                  });
          });

          console.log("Phrase:", phrase);
          console.log("Count:", count);
      });
        // Add labels to bubbles
        svg.selectAll(".label")
            .data(nodes)
            .enter()
            .append("text")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("dy", "0.3em")
            .attr("text-anchor", "middle")
            .text(d => d.data.phrase)
            .style("font-size", d => `${Math.min(12, d.r * 0.5)}px`)
            .style("fill", "white");

        // Update the `.pageInfo` div 
        updateModelInfo(model);
    });
}



// use dropdown to switch model 
document.getElementById("wd14").addEventListener("click", () => {
    currentModel = "wd14";
    loadModel(currentModel);
});

document.getElementById("google").addEventListener("click", () => {
    currentModel = "google_vit";
    loadModel(currentModel);
});

document.getElementById("microsoft").addEventListener("click", () => {
    currentModel = "microsoft";
    loadModel(currentModel);
});

document.getElementById("oschamp").addEventListener("click", () => {
    currentModel = "oschamp";
    loadModel(currentModel);
});


loadModel(currentModel)