"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

//Build Volcano Contours
//volcano.json originated from https://observablehq.com/@d3/volcano-contours/2
//base code used from https://d3-graph-gallery.com/graph/density2d_contour.html
export default function Home() {
    const svgRef = useRef();

    useEffect(() => {
        //define width, height, and its margins
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        const width = 800;
        const height = 600;

        //create our svg and its bounds
        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        //in the initial starter code, it used a .csv, however the file I used is in .json and it is in a different format.
        //this is the easier way, where we just grab the JSON values array and boom pass it through (no need to individually map)
        d3.json("/volcano.json").then((contourValues) => {
            const { width: gridWidth, height: gridHeight, values } = contourValues;

            //create our contour lines
            const contours = d3.contours()
                .size([gridWidth, gridHeight])
                .thresholds(20)(values);

            //scale our SVG
            const scaleX = width / gridWidth;
            const scaleY = height / gridHeight;
            const transform = d3.geoTransform({
                point: function (x, y) {
                    this.stream.point(x * scaleX, y * scaleY);
                },
            });

            //we make it now!
            const path = d3.geoPath().projection(transform);
            svg.selectAll("path")
                .data(contours)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", "none")
                .attr("stroke", "#69b3a2")
                .attr("stroke-linejoin", "round");
        });
    }, []);

    return (
        <main className="flex items-center justify-center min-h-screen bg-white">
            {/* Call our SVG to be drawn onto the HTML */}
            <svg ref={svgRef}></svg>
        </main>
    );
}
