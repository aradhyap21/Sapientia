const sentiment = require('sentiment');

class SentimentAnalysisService {
  constructor() {
    this.analyzer = new sentiment();
  }
  
  /**
   * Analyzes the sentiment of a text and returns a score and assessment
   * @param {string} text - The text to analyze
   * @returns {Object} - Sentiment analysis result with score and assessment
   */
  analyzeSentiment(text) {
    const result = this.analyzer.analyze(text);
    
    let assessment = 'neutral';
    if (result.score > 3) {
      assessment = 'very positive';
    } else if (result.score > 0) {
      assessment = 'positive';
    } else if (result.score < -3) {
      assessment = 'very negative';
    } else if (result.score < 0) {
      assessment = 'negative';
    }
    
    return {
      score: result.score,
      comparative: result.comparative,
      assessment,
      tokens: result.tokens,
      positive: result.positive,
      negative: result.negative
    };
  }
  
  /**
   * Provides content recommendations based on sentiment analysis
   * @param {string} text - The text to analyze
   * @returns {Object} - Recommendations object
   */
  getContentRecommendations(text) {
    const analysis = this.analyzeSentiment(text);
    
    let recommendations = {
      tone: '',
      suggestions: []
    };
    
    if (analysis.assessment === 'very negative' || analysis.assessment === 'negative') {
      recommendations.tone = 'Your content has a negative tone.';
      recommendations.suggestions = [
        'Consider balancing criticism with constructive suggestions.',
        'Try incorporating some positive aspects to provide balance.',
        'Check if emotional language might be excessive.'
      ];
    } else if (analysis.assessment === 'neutral') {
      recommendations.tone = 'Your content has a neutral tone.';
      recommendations.suggestions = [
        'Consider adding more engaging or descriptive language.',
        'Your balanced approach works well for informational content.'
      ];
    } else {
      recommendations.tone = 'Your content has a positive tone.';
      recommendations.suggestions = [
        'Ensure enthusiasm feels authentic and appropriate for the topic.',
        'Consider if critical evaluation might be useful in some areas.'
      ];
    }
    
    return recommendations;
  }
}

module.exports = new SentimentAnalysisService();
