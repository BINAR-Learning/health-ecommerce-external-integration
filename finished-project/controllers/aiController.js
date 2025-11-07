/**
 * AI Controller
 * Handle AI chatbot requests
 */

const aiService = require("../services/aiService");

exports.askAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    if (question.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Question too long (max 500 characters)",
      });
    }

    const result = await aiService.getHealthRecommendation(question);

    console.log(
      `AI Question from ${req.user?.email || "anonymous"}: "${question}"`
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process AI request",
    });
  }
};

/**
 * Chat with AI (alternative endpoint for frontend compatibility)
 * Accepts message and context parameters
 */
exports.chatAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Message too long (max 500 characters)",
      });
    }

    // Use the message as question
    const result = await aiService.getHealthRecommendation(message);

    console.log(
      `AI Chat from ${req.user?.email || "anonymous"}: "${message}" (context: ${context || 'none'})`
    );

    // Return in format expected by frontend
    res.json({
      success: result.success !== false,
      answer: result.answer || result.message,
      recommendedProducts: result.recommendedProducts || [],
      ...result
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to process AI chat request",
      answer: "Maaf, saya mengalami kendala teknis. Silakan coba lagi.",
      recommendedProducts: []
    });
  }
};