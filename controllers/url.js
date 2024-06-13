const shortid=require("shortid");
const URL=require("../models/url");

const handleGenerateNewURL = async (req,res)=>{
    const body=req.body;
    if(!body.url) return res.status(400).json({error: "url is required"})
    const shortID = shortid(8);

    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });

    return res.render("home",{
        id: shortID,
    });
}
// const handleGetAnalytics = async(req,res)=>{
//     const shortId=req.params.shortId;
//     const result=await URL.findOneAndUpdate({shortId});

//     return res.json({totalClicks:result.visitHistory.length,
//                      analytics:result.visitHistory,
//                     }
//                     );
// }
const handleGetAnalytics = async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const result = await URL.findOne({ shortId });

        // Check if result is null
        if (!result) {
            return res.status(404).json({ error: "URL not found" });
        }

        // Check if visitHistory is defined and is an array
        if (!result.visitHistory || !Array.isArray(result.visitHistory)) {
            return res.status(500).json({ error: "visitHistory is not available" });
        }

        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


module.exports={
    handleGenerateNewURL,
    handleGetAnalytics,
}