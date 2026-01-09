let visibilityRange = 45;
let nodeVisited = 0;
let TotalNodes = 0;
let progressBg;
let hiddenNodes;
let ht_pole = [];
let aciveHts = [];

pano.addListener("configloaded", () => {
    TotalNodes = pano.getNodeIds().length;
    hiddenNodes = pano.getNodesWithTag("Hidden");
    TotalNodes = hiddenNodes && TotalNodes ? TotalNodes - hiddenNodes.length : TotalNodes;
    progressBg = document.querySelectorAll(".progressBg");

    // watch current angle
    const setFlag = () => {
        let panoramaWidth = pano.getViewerSize().width;
        // set the visibility range based on the width of the panorama ratio of 3 : 85
        visibilityRange = pano.isFullscreen ? Math.round((panoramaWidth / 95) * 3) : Math.round((panoramaWidth / 85) * 3);
        // visibilityRange does not exceed 54
        visibilityRange = pano.isFullscreen ? Math.min(visibilityRange, 50) : Math.min(visibilityRange, 54);

        const isWithinRange = (currentAngle, ht_pan) => {
            let diff = (ht_pan - currentAngle + 360) % 360;  // Get the angular difference and normalize it to [0, 360]
            if (diff > 180) diff -= 360;  // Adjust to the [-180, 180] range
            return Math.abs(diff) <= visibilityRange;
        }

        let currentAngle = pano.getPanN();
        ht_pole && ht_pole.forEach(ht => {
            let ht_obj = pano.getHotspot(ht);
            let ht_pan = ht_obj.pan;
            let ht_ele = ht_obj.div;
            let ht_description = ht_obj.description;

            if (ht_description == "No Transition") {
                ht_ele.classList.remove("inactive");
                ht_ele.classList.add("active");
                return;
            }

            // check ht_pan is near to the current angle (+/- visibilityRange deg)
            if (isWithinRange(currentAngle, ht_pan)) {
                if (!aciveHts.includes(ht)) {
                    aciveHts.push(ht);
                    ht_ele.classList.remove("inactive");
                    ht_ele.classList.add("active", "protected");
                    setTimeout(() => {
                        ht_ele.classList.remove("protected");
                    }, 1100);
                }
            } else {
                if (aciveHts.includes(ht)) {
                    aciveHts.splice(aciveHts.indexOf(ht), 1);
                    if (!ht_ele.classList.contains("protected")) {
                        ht_ele.classList.remove("active");
                        ht_ele.classList.add("inactive");
                    } else {
                        const checkProtection = setInterval(() => {
                            if (aciveHts.includes(ht)) {
                                clearInterval(checkProtection);
                                return;
                            }

                            if (!ht_ele.classList.contains("protected")) {
                                ht_ele.classList.remove("active");
                                ht_ele.classList.add("inactive");

                                // Clear the interval
                                clearInterval(checkProtection);
                            }
                        }, 300);

                    }
                }
            }
        });
    };

    // watch auto rotation
    pano.on("positionchanged", () => {
        if (pano.getVariableValue("PreLaunch") && pano.getFov() <= 75) {
            setFlag();
        }
    })

    pano.on("changenode", function (e) {
        let currentNode = pano.getCurrentNode();
        if (!pano.nodeVisited(currentNode) && !hiddenNodes.includes(currentNode)) {
            nodeVisited += 1;
            // calculate % of nodes visited
            let percentVisited = Math.round((nodeVisited / TotalNodes) * 100);
            pano.setVariableValue("tourProgress", percentVisited);
            progressBg.forEach(ele => ele.style.width = percentVisited + "%");
        }

        // initiate function
        getHostpots();
        aciveHts = [];
        (pano.getLastVisitedNode() == "" && pano.getVariableValue("StartNode") !== currentNode) && setFlag();
        (pano.getVariableValue("PreLaunch") && pano.getLastVisitedNode()) && setTimeout(() => setFlag(), 1000);
    });

    const getHostpots = () => {
        let ht = pano.getPointHotspotIds();
        ht_pole = ht.filter((ht) => {
            return pano.getHotspot(ht).skinid == "ht_info_pole";
        })
    }
})
