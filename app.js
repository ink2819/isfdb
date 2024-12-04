// Dimensions of the visualization
const width = 800;
const height = 600;

// Create an SVG container
const svg = d3.select(".viz")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Create a tooltip
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

// Placeholder for stevens_info.csv data
let infoData = [];

// Load both CSV files
Promise.all([
    d3.csv("stevens_wdtags.csv"),
    d3.csv("stevens_info.csv")
]).then(([tagsData, infoCsv]) => {
    // Parse stevens_info.csv and store it in memory
    infoData = infoCsv;

    infoCsv.forEach(row => {
        console.log("Row ID:", row[""]);
        console.log("Cover Image Link:", row["Cover Image Link"]);
    });

    // Parse stevens_wdtags.csv
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

    // Convert phraseCounts into an array of objects
    const phraseData = Object.entries(phraseCounts).map(([key, value]) => ({
        phrase: key,
        count: value.count,
        ids: value.ids
    }));

    // Create a bubble chart layout
    const bubble = d3.pack()
        .size([width, height])
        .padding(5);

    // Generate a hierarchy and calculate bubble sizes
    const root = d3.hierarchy({ children: phraseData })
        .sum(d => d.count);

    const nodes = bubble(root).leaves();

    // Create bubbles
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
            // Change color on hover
            d3.select(this).style("fill", "darkgreen");

            // Show tooltip
            tooltip.style("visibility", "visible")
                .text(d.data.phrase)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY + 10}px`);
        })
        .on("mousemove", function (event) {
            // Update tooltip position
            tooltip.style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY + 10}px`);
        })
        .on("mouseout", function () {
            // Revert color and hide tooltip
            d3.select(this).style("fill", "green");
            tooltip.style("visibility", "hidden");
        })
        .on("click", function (_, d) {
            // Load and display matching images in the .info div
            const matchingIds = d.data.ids;
            const matchingImages = infoData.filter(row => matchingIds.includes(row.id))
                                           .map(row => row["Cover Image Link"]);
        
            const infoDiv = d3.select(".info");
            infoDiv.html(""); // Clear previous content
        
            matchingImages.forEach(link => {
                infoDiv.append("img")
                    .attr("src", link)
                    .attr("alt", "Cover Image")
                    .style("max-width", "100px")
                    .style("margin", "5px");
            });
        });        
    

    // Add text labels to bubbles
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
