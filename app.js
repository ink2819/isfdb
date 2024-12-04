const width = 1000;
const height = 1000;

// containter =svg
const svg = d3.select(".viz")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Tooltip
const tooltip = d3.select(".viz")
    .append("div")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ccc")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)")
    .style("visibility", "hidden")
    .style("font-size", "12px")
    .style("color", "#333");

// infoData = Stevens_info.csv
let infoData = [];

// tagsData = Stevens_wdtags.csv
Promise.all([
    d3.csv("stevens_wdtags.csv"),
    d3.csv("stevens_info.csv")
]).then(([tagsData, infoCsv]) => {
    infoData = infoCsv;

    infoCsv.forEach(row => {
        console.log("Row ID:", row[""]);
        console.log("Cover Image Link:", row["Cover Image Link"]);
    });

// parse phrases from wdtags, make phraseCounts
    const phraseCounts = {};
    tagsData.forEach(row => {
        const phrases = row["tags"].split(",").map(d => d.trim());
        const id = row["id"];
        phrases.forEach(phrase => {
            if (!phraseCounts[phrase]) {
                phraseCounts[phrase] = { count: 0, ids: [] };
            }
            phraseCounts[phrase].count++;
            phraseCounts[phrase].ids.push(id);
        });
    });

    console.log("Final phraseCounts:", phraseCounts);

// Convert phraseCounts into an array called phraseData
    const phraseData = Object.entries(phraseCounts).map(([key, value]) => ({
        phrase: key,
        count: value.count,
        ids: value.ids
    }));
//BubbleChart
    const bubble = d3.pack()
        .size([width, height])
        .padding(5);

    const root = d3.hierarchy({ children: phraseData })
        .sum(d => d.count);

    const nodes = bubble(root).leaves();

    const bubbles = svg.selectAll(".bubble")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.r)
        .style("fill", "green")
        .style("opacity", 0.8)
        .style("stroke", "#000")
        .style("stroke-width", "1px")
        .on("mouseover", function (event, d) {
            d3.select(this).style("fill", "darkgreen");

            // tooltip to bubbles
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
//onclick show images
        .on("click", function (_, d) {
            const matchingIds = d.data.ids;
            const matchingImages = infoData.filter(row => matchingIds.includes(row.id))
                                           .map(row => row["Cover Image Link"]);
        
            const infoDiv = d3.select(".info");
            infoDiv.html(""); 
        
            matchingImages.forEach(link => {
                infoDiv.append("img")
                    .attr("src", link)
                    .attr("alt", "Cover Image")
                    .style("max-width", "100px")
                    .style("margin", "5px");
            });
        });        
    

//bubble labels
    svg.selectAll(".label")
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("dy", "0.3em")
        .attr("text-anchor", "middle")
        .text(d => d.data.phrase)
        .style("font-size", "10px")
        .style("fill", "white");
}).catch(error => {
    console.error("Error loading the CSV files:", error);
});
