"""
Free AI Evaluator - Uses Hugging Face models (no API key needed)
"""

from sentence_transformers import SentenceTransformer, util
import re

class FreeAIEvaluator:
    def __init__(self):
        print("⏳ Loading AI models (first time may take a few minutes)...")
        self.similarity_model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✅ Models loaded successfully!")
    
    def evaluate_answer(self, question, answer, ideal_answer, keywords, category):
        """Evaluate answer using free ML models"""
        
        if not answer.strip():
            return self._empty_evaluation()
        
        # 1. Semantic Similarity Score
        q_embedding = self.similarity_model.encode(question, convert_to_tensor=True)
        a_embedding = self.similarity_model.encode(answer, convert_to_tensor=True)
        ideal_embedding = self.similarity_model.encode(ideal_answer, convert_to_tensor=True)
        
        similarity_to_ideal = util.cos_sim(a_embedding, ideal_embedding).item()
        semantic_score = min(10, max(0, similarity_to_ideal * 10))
        
        # 2. Keyword Coverage
        answer_lower = answer.lower()
        keywords_found = sum(1 for kw in keywords if kw.lower() in answer_lower)
        keyword_coverage = (keywords_found / len(keywords)) * 100 if keywords else 0
        keyword_score = (keyword_coverage / 10)
        
        # 3. Answer Quality Metrics
        sentences = [s.strip() for s in re.split(r'[.!?]+', answer) if s.strip()]
        words = answer.split()
        
        # Length score
        word_count = len(words)
        if word_count < 20:
            length_score = 3
        elif word_count < 50:
            length_score = 6
        elif word_count < 100:
            length_score = 8
        else:
            length_score = 9
        
        # Structure score
        structure_score = min(10, len(sentences) * 2)
        
        # 4. Calculate Overall Score
        overall_score = (
            semantic_score * 0.4 +
            keyword_score * 0.3 +
            length_score * 0.2 +
            structure_score * 0.1
        )
        overall_score = round(min(10, max(0, overall_score)), 1)
        
        # 5. Generate Feedback
        strengths = []
        weaknesses = []
        
        if semantic_score >= 7:
            strengths.append("Strong alignment with expected answer")
        if keyword_coverage >= 60:
            strengths.append(f"Good coverage of key concepts ({int(keyword_coverage)}%)")
        if word_count >= 50:
            strengths.append("Comprehensive and detailed response")
        if len(sentences) >= 3:
            strengths.append("Well-structured answer with multiple points")
        
        if semantic_score < 5:
            weaknesses.append("Answer could be more relevant to the question")
        if keyword_coverage < 40:
            weaknesses.append(f"Missing key concepts (only {int(keyword_coverage)}% covered)")
        if word_count < 30:
            weaknesses.append("Answer is too brief - add more detail")
        if len(sentences) < 2:
            weaknesses.append("Improve structure with multiple sentences")
        
        # Default messages if empty
        if not strengths:
            strengths = ["Answer provided", "Shows basic understanding"]
        if not weaknesses:
            weaknesses = ["Consider adding specific examples"]
        
        # Generate feedback
        if overall_score >= 8:
            feedback = "Excellent answer! You demonstrated strong understanding with good detail."
        elif overall_score >= 6:
            feedback = "Good answer with solid foundation. Consider adding more specific examples."
        elif overall_score >= 4:
            feedback = "Adequate answer but needs more depth and coverage of key concepts."
        else:
            feedback = "Answer needs significant improvement. Focus on key concepts and provide more detail."
        
        return {
            "score": overall_score,
            "semantic_similarity": round(semantic_score, 1),
            "keyword_coverage": round(keyword_coverage, 1),
            "clarity_score": round(structure_score, 1),
            "depth_score": round(length_score, 1),
            "strengths": strengths[:4],
            "weaknesses": weaknesses[:4],
            "feedback": feedback,
            "ideal_answer": ideal_answer
        }
    
    def _empty_evaluation(self):
        return {
            "score": 0,
            "semantic_similarity": 0,
            "keyword_coverage": 0,
            "clarity_score": 0,
            "depth_score": 0,
            "strengths": [],
            "weaknesses": ["No answer provided"],
            "feedback": "Please provide an answer.",
            "ideal_answer": ""
        }
