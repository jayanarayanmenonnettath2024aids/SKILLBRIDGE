"""
Company-Specific Question Generator
Generates questions based on company and role
"""

COMPANY_PROFILES = {
    "Google": {
        "focus_areas": ["scalability", "algorithms", "system design", "innovation", "user experience"],
        "culture": ["data-driven decisions", "innovation", "collaboration", "impact"],
        "tech_stack": ["Python", "Java", "Go", "Kubernetes", "TensorFlow"]
    },
    "Amazon": {
        "focus_areas": ["customer obsession", "ownership", "leadership principles", "scalability"],
        "culture": ["customer first", "bias for action", "frugality", "ownership"],
        "tech_stack": ["Java", "Python", "AWS", "DynamoDB", "Lambda"]
    },
    "Microsoft": {
        "focus_areas": ["cloud computing", "AI", "productivity", "accessibility"],
        "culture": ["growth mindset", "innovation", "diversity", "customer success"],
        "tech_stack": ["C#", ".NET", "Azure", "TypeScript", "React"]
    },
    "Meta": {
        "focus_areas": ["social networking", "AI/ML", "mobile", "VR/AR"],
        "culture": ["move fast", "bold", "focus on impact", "be open"],
        "tech_stack": ["Python", "React", "GraphQL", "PyTorch", "Hack"]
    },
    "Apple": {
        "focus_areas": ["design excellence", "user privacy", "hardware-software integration"],
        "culture": ["innovation", "excellence", "privacy", "simplicity"],
        "tech_stack": ["Swift", "Objective-C", "Metal", "Core ML"]
    },
    "Netflix": {
        "focus_areas": ["streaming", "personalization", "microservices", "chaos engineering"],
        "culture": ["freedom and responsibility", "context not control", "high performance"],
        "tech_stack": ["Java", "Python", "Node.js", "AWS", "Cassandra"]
    },
    "Startup": {
        "focus_areas": ["rapid development", "MVP", "growth", "adaptability"],
        "culture": ["fast-paced", "ownership", "innovation", "flexibility"],
        "tech_stack": ["varies", "modern stack", "cloud-native"]
    }
}

def get_company_questions(company, role):
    """Generate company-specific questions"""
    
    company_profile = COMPANY_PROFILES.get(company, COMPANY_PROFILES["Startup"])
    
    questions = []
    
    # HR Questions
    questions.append({
        "question": f"Why do you want to work at {company} specifically?",
        "category": "HR - Company Fit",
        "ideal_answer": f"Research {company}'s products, culture ({', '.join(company_profile['culture'])}), recent achievements, and explain how your values and skills align. Show genuine enthusiasm and knowledge about the company.",
        "keywords": ["research", company, "culture", "products", "alignment", "enthusiasm"] + company_profile["culture"]
    })
    
    questions.append({
        "question": f"How do your values align with {company}'s culture?",
        "category": "HR - Cultural Fit",
        "ideal_answer": f"Discuss {company}'s core values: {', '.join(company_profile['culture'])}. Provide specific examples from your experience that demonstrate these values.",
        "keywords": company_profile["culture"] + ["values", "examples", "alignment"]
    })
    
    # Technical Questions based on company focus
    if "Software" in role or "Developer" in role or "Engineer" in role:
        questions.append({
            "question": f"Describe your experience with technologies used at {company}.",
            "category": "Technical - Technology Stack",
            "ideal_answer": f"Discuss experience with {company}'s tech stack: {', '.join(company_profile['tech_stack'])}. Mention specific projects, challenges solved, and depth of knowledge.",
            "keywords": company_profile["tech_stack"] + ["experience", "projects", "expertise"]
        })
        
        if company in ["Google", "Amazon", "Meta"]:
            questions.append({
                "question": f"How would you design a system to handle {company}'s scale?",
                "category": "Technical - System Design",
                "ideal_answer": "Discuss scalability, load balancing, caching, database sharding, microservices, monitoring. Consider millions/billions of users, high availability, low latency.",
                "keywords": ["scalability", "distributed systems", "load balancing", "caching", "microservices", "high availability"]
            })
    
    # Company-specific scenario questions
    if company == "Amazon":
        questions.append({
            "question": "Tell me about a time you demonstrated 'Customer Obsession'.",
            "category": "Scenario - Leadership Principles",
            "ideal_answer": "Use STAR method. Describe situation where you prioritized customer needs, gathered feedback, made data-driven decisions, and delivered measurable customer value.",
            "keywords": ["customer obsession", "STAR", "customer needs", "feedback", "impact", "data-driven"]
        })
    elif company == "Google":
        questions.append({
            "question": "Describe a time you solved a complex technical problem with an innovative solution.",
            "category": "Scenario - Innovation",
            "ideal_answer": "Explain the problem, your analytical approach, innovative solution, implementation, and measurable impact. Emphasize creativity and technical depth.",
            "keywords": ["innovation", "problem solving", "analytical", "creative", "impact", "technical"]
        })
    elif company == "Meta":
        questions.append({
            "question": "Tell me about a time you moved fast and took calculated risks.",
            "category": "Scenario - Move Fast",
            "ideal_answer": "Describe situation requiring quick decision, how you assessed risks, executed rapidly, learned from results. Show bias for action while being thoughtful.",
            "keywords": ["move fast", "risk taking", "decision making", "execution", "learning", "impact"]
        })
    else:
        questions.append({
            "question": f"Describe a challenging project relevant to {company}'s focus areas.",
            "category": "Scenario - Project Experience",
            "ideal_answer": f"Discuss project related to {', '.join(company_profile['focus_areas'])}. Explain challenges, your approach, technical decisions, and outcomes.",
            "keywords": company_profile["focus_areas"] + ["project", "challenges", "solutions", "outcomes"]
        })
    
    # Role-specific technical question
    if "Data" in role:
        questions.append({
            "question": f"How would you approach data analysis/ML problems at {company}?",
            "category": "Technical - Data/ML",
            "ideal_answer": f"Discuss {company}'s data challenges, scale, tools. Mention statistical methods, ML algorithms, A/B testing, experimentation, and measuring impact.",
            "keywords": ["data analysis", "machine learning", "scale", "experimentation", "metrics", "impact"]
        })
    
    return questions

def get_available_companies():
    """Get list of available companies"""
    return list(COMPANY_PROFILES.keys())
