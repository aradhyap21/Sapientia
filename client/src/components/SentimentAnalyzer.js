import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, CircularProgress, Paper, Chip, Divider, List, ListItem, ListItemText } from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const SentimentAnalyzer = ({ content, onClose }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeContent = async () => {
    if (!content.trim()) {
      setError('No content to analyze');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await axios.post('/api/sentiment/analyze', { content });
      setAnalysis(data);
    } catch (err) {
      console.error('Error analyzing content:', err);
      setError(err.response?.data?.error || 'Failed to analyze content');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (assessment) => {
    if (assessment.includes('positive')) {
      return <SentimentSatisfiedAltIcon color="success" />;
    } else if (assessment.includes('negative')) {
      return <SentimentVeryDissatisfiedIcon color="error" />;
    } else {
      return <SentimentNeutralIcon color="action" />;
    }
  };

  return (
    <Box sx={{ mt: 2, mb: 3 }}>
      <Button 
        variant="outlined" 
        onClick={analyzeContent} 
        disabled={loading}
        startIcon={<TipsAndUpdatesIcon />}
      >
        Analyze Content Sentiment
      </Button>
      
      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress size={24} />
        </Box>
      )}
      
      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
      
      {analysis && (
        <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Sentiment Analysis Results
          </Typography>
          
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="subtitle1" mr={1}>
              Overall Sentiment:
            </Typography>
            {getSentimentIcon(analysis.analysis.assessment)}
            <Chip 
              label={analysis.analysis.assessment} 
              sx={{ ml: 1 }} 
              color={
                analysis.analysis.assessment.includes('positive') ? 'success' : 
                analysis.analysis.assessment.includes('negative') ? 'error' : 
                'default'
              }
            />
          </Box>
          
          <Typography variant="body2" gutterBottom>
            Sentiment Score: {analysis.analysis.score} (Comparative: {analysis.analysis.comparative.toFixed(3)})
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            {analysis.recommendations.tone}
          </Typography>
          
          <List dense>
            {analysis.recommendations.suggestions.map((suggestion, index) => (
              <ListItem key={index}>
                <ListItemText primary={suggestion} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SentimentAnalyzer;
