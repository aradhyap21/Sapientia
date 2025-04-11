const sentimentAnalysisService = require('../services/sentimentAnalysisService');

const analyzeBlogContent = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required for analysis' });
    }
    
    const sentimentAnalysis = sentimentAnalysisService.analyzeSentiment(content);
    const recommendations = sentimentAnalysisService.getContentRecommendations(content);
    
    return res.status(200).json({
      analysis: sentimentAnalysis,
      recommendations
    });
  } catch (error) {
    console.error('Error analyzing content sentiment:', error);
    return res.status(500).json({ error: 'Failed to analyze content sentiment' });
  }
};

module.exports = {
  analyzeBlogContent
};
