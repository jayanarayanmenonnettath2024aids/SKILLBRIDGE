"""
Question Bank - Role-specific interview questions with ideal answers
"""

QUESTION_BANK = {
    "Software Developer": {
        "hr": [
            {
                "question": "Tell me about yourself and your technical background.",
                "category": "HR",
                "ideal_answer": "A strong answer includes: educational background, relevant technical skills, key projects or work experience, passion for software development, and career goals. Should be concise (2-3 minutes) and highlight achievements with specific examples.",
                "keywords": ["education", "experience", "skills", "projects", "passion", "goals"]
            },
            {
                "question": "Why do you want to work for our company?",
                "category": "HR",
                "ideal_answer": "Research-based answer showing knowledge of company's products, culture, and values. Mention specific technologies they use, recent achievements, or projects that align with your interests.",
                "keywords": ["research", "company", "culture", "products", "alignment", "enthusiasm"]
            }
        ],
        "technical": [
            {
                "question": "Explain the difference between REST and GraphQL APIs.",
                "category": "Technical",
                "ideal_answer": "REST uses multiple endpoints with standard HTTP methods. GraphQL uses a single endpoint where clients specify exactly what data they need. GraphQL prevents over-fetching and under-fetching, has strong typing through schemas.",
                "keywords": ["endpoints", "HTTP methods", "query", "over-fetching", "schema", "flexibility"]
            },
            {
                "question": "What is the difference between synchronous and asynchronous programming?",
                "category": "Technical",
                "ideal_answer": "Synchronous programming executes code sequentially, blocking until each operation completes. Asynchronous programming allows multiple operations to run concurrently without blocking using callbacks, promises, or async/await patterns.",
                "keywords": ["blocking", "concurrent", "promises", "async", "callbacks", "performance"]
            }
        ],
        "scenario": [
            {
                "question": "You discover a critical bug in production. How do you handle it?",
                "category": "Scenario",
                "ideal_answer": "Assess severity, notify team lead, check logs, implement rollback if needed, reproduce bug, identify root cause, implement fix, test thoroughly, deploy, conduct post-mortem, document learnings.",
                "keywords": ["assess", "notify", "rollback", "reproduce", "root cause", "fix", "test", "communication"]
            }
        ]
    },
    "Data Analyst": {
        "hr": [
            {
                "question": "Tell me about your experience with data analysis.",
                "category": "HR",
                "ideal_answer": "Strong answer includes: educational background in statistics/analytics, experience with data tools (Excel, SQL, Python/R, visualization tools), specific projects where data insights drove decisions.",
                "keywords": ["education", "tools", "SQL", "Python", "visualization", "insights", "projects"]
            }
        ],
        "technical": [
            {
                "question": "Explain the difference between correlation and causation.",
                "category": "Technical",
                "ideal_answer": "Correlation means two variables move together statistically, but doesn't imply one causes the other. Causation means one variable directly influences another. Need controlled experiments to establish causation.",
                "keywords": ["correlation", "causation", "confounding", "experiment", "statistical", "relationship"]
            },
            {
                "question": "How would you handle missing data in a dataset?",
                "category": "Technical",
                "ideal_answer": "Approach depends on amount and pattern of missing data. Methods include deletion, imputation (mean/median/mode), forward/backward fill, or predictive imputation. Always document approach and assess impact.",
                "keywords": ["missing data", "deletion", "imputation", "mean", "median", "pattern", "impact"]
            }
        ],
        "scenario": [
            {
                "question": "Your analysis contradicts stakeholder expectations. How do you present this?",
                "category": "Scenario",
                "ideal_answer": "Verify analysis thoroughly, understand stakeholder expectations, prepare clear visualizations, present data objectively with context, explain methodology, discuss reasons for unexpected results, provide recommendations.",
                "keywords": ["verify", "visualizations", "objective", "methodology", "context", "recommendations"]
            }
        ]
    },
    "Data Scientist": {
        "hr": [
            {
                "question": "What motivated you to pursue data science?",
                "category": "HR",
                "ideal_answer": "Discuss passion for solving problems with data, interest in machine learning and statistics, specific projects or experiences that sparked interest, career goals in data science.",
                "keywords": ["passion", "machine learning", "statistics", "problem solving", "projects", "goals"]
            }
        ],
        "technical": [
            {
                "question": "Explain the bias-variance tradeoff in machine learning.",
                "category": "Technical",
                "ideal_answer": "Bias is error from overly simplistic models (underfitting). Variance is error from overly complex models (overfitting). Goal is to find balance that minimizes total error on new data.",
                "keywords": ["bias", "variance", "underfitting", "overfitting", "tradeoff", "generalization"]
            },
            {
                "question": "What is cross-validation and why is it important?",
                "category": "Technical",
                "ideal_answer": "Cross-validation splits data into training and validation sets multiple times to assess model performance. Helps prevent overfitting and provides more reliable performance estimates than single train-test split.",
                "keywords": ["cross-validation", "training", "validation", "overfitting", "k-fold", "performance"]
            }
        ],
        "scenario": [
            {
                "question": "Your model performs well in training but poorly in production. What do you do?",
                "category": "Scenario",
                "ideal_answer": "Check for data drift, verify feature engineering pipeline, examine training vs production data distributions, review model assumptions, implement monitoring, retrain with recent data if needed.",
                "keywords": ["data drift", "production", "monitoring", "features", "distribution", "retrain"]
            }
        ]
    },
    "Product Manager": {
        "hr": [
            {
                "question": "Why do you want to be a Product Manager?",
                "category": "HR",
                "ideal_answer": "Discuss passion for building products that solve user problems, interest in bridging technical and business aspects, experience working with cross-functional teams, strategic thinking skills.",
                "keywords": ["product", "user problems", "cross-functional", "strategy", "business", "technical"]
            }
        ],
        "technical": [
            {
                "question": "How do you prioritize features in a product roadmap?",
                "category": "Technical",
                "ideal_answer": "Use frameworks like RICE (Reach, Impact, Confidence, Effort) or value vs effort matrix. Consider user needs, business goals, technical feasibility, competitive landscape, and resource constraints.",
                "keywords": ["prioritization", "RICE", "roadmap", "user needs", "business goals", "feasibility"]
            },
            {
                "question": "Explain how you would measure product success.",
                "category": "Technical",
                "ideal_answer": "Define clear KPIs aligned with business goals (user engagement, retention, revenue, NPS). Use analytics tools, A/B testing, user feedback, and cohort analysis to track metrics over time.",
                "keywords": ["KPIs", "metrics", "analytics", "A/B testing", "engagement", "retention", "success"]
            }
        ],
        "scenario": [
            {
                "question": "Engineering says a feature will take 6 months but stakeholders want it in 2 months. How do you handle this?",
                "category": "Scenario",
                "ideal_answer": "Understand technical constraints, identify MVP scope, negotiate on features vs timeline, communicate tradeoffs clearly to stakeholders, explore alternative solutions, set realistic expectations.",
                "keywords": ["negotiation", "MVP", "tradeoffs", "communication", "stakeholders", "realistic"]
            }
        ]
    },
    "Marketing Manager": {
        "hr": [
            {
                "question": "Describe your marketing experience and key achievements.",
                "category": "HR",
                "ideal_answer": "Highlight campaigns managed, channels used (digital, social, content), measurable results (ROI, conversions, engagement), team leadership experience, strategic planning skills.",
                "keywords": ["campaigns", "digital marketing", "ROI", "conversions", "strategy", "leadership"]
            }
        ],
        "technical": [
            {
                "question": "How do you measure marketing campaign effectiveness?",
                "category": "Technical",
                "ideal_answer": "Track metrics like CTR, conversion rate, CAC, LTV, ROI. Use analytics tools (Google Analytics, social media insights), attribution models, A/B testing, and cohort analysis.",
                "keywords": ["metrics", "CTR", "conversion", "CAC", "LTV", "ROI", "analytics", "attribution"]
            },
            {
                "question": "Explain your approach to content marketing strategy.",
                "category": "Technical",
                "ideal_answer": "Define target audience, create buyer personas, develop content pillars, plan content calendar, optimize for SEO, distribute across channels, measure engagement and conversions.",
                "keywords": ["content strategy", "audience", "personas", "SEO", "engagement", "distribution"]
            }
        ],
        "scenario": [
            {
                "question": "Your marketing budget was cut by 30%. How do you adapt your strategy?",
                "category": "Scenario",
                "ideal_answer": "Analyze ROI of current channels, focus on high-performing channels, leverage organic/owned media, optimize existing campaigns, explore partnerships, get creative with low-cost tactics.",
                "keywords": ["budget", "ROI", "optimization", "organic", "partnerships", "efficiency"]
            }
        ]
    },
    "UI/UX Designer": {
        "hr": [
            {
                "question": "What inspired you to become a UI/UX designer?",
                "category": "HR",
                "ideal_answer": "Discuss passion for creating user-friendly experiences, interest in psychology and design, portfolio highlights, design philosophy, continuous learning in design trends.",
                "keywords": ["user experience", "design", "portfolio", "psychology", "creativity", "trends"]
            }
        ],
        "technical": [
            {
                "question": "Explain your design process from research to final design.",
                "category": "Technical",
                "ideal_answer": "User research, personas, user flows, wireframes, prototypes, usability testing, iterate based on feedback, high-fidelity designs, handoff to developers, post-launch evaluation.",
                "keywords": ["research", "personas", "wireframes", "prototypes", "testing", "iteration", "handoff"]
            },
            {
                "question": "How do you ensure your designs are accessible?",
                "category": "Technical",
                "ideal_answer": "Follow WCAG guidelines, ensure proper color contrast, provide alt text, keyboard navigation, screen reader compatibility, test with accessibility tools, consider diverse user needs.",
                "keywords": ["accessibility", "WCAG", "contrast", "alt text", "keyboard", "screen reader", "inclusive"]
            }
        ],
        "scenario": [
            {
                "question": "Stakeholders want to add many features but you believe it will hurt UX. How do you handle this?",
                "category": "Scenario",
                "ideal_answer": "Present user research data, show usability testing results, explain design principles, propose phased approach, create prototypes to demonstrate impact, find compromise that balances business and user needs.",
                "keywords": ["user research", "data", "principles", "compromise", "prototypes", "balance"]
            }
        ]
    },
    "DevOps Engineer": {
        "hr": [
            {
                "question": "What interests you about DevOps?",
                "category": "HR",
                "ideal_answer": "Discuss passion for automation, improving development workflows, bridging dev and ops, experience with CI/CD, infrastructure as code, monitoring and reliability.",
                "keywords": ["automation", "CI/CD", "infrastructure", "workflows", "reliability", "monitoring"]
            }
        ],
        "technical": [
            {
                "question": "Explain the concept of Infrastructure as Code.",
                "category": "Technical",
                "ideal_answer": "IaC manages infrastructure through code rather than manual processes. Benefits include version control, reproducibility, automation, consistency. Tools include Terraform, CloudFormation, Ansible.",
                "keywords": ["IaC", "automation", "version control", "Terraform", "reproducibility", "consistency"]
            },
            {
                "question": "How do you approach monitoring and alerting?",
                "category": "Technical",
                "ideal_answer": "Define key metrics (latency, error rates, throughput), set up logging and monitoring tools (Prometheus, Grafana), create meaningful alerts, establish on-call procedures, implement observability.",
                "keywords": ["monitoring", "metrics", "alerts", "logging", "Prometheus", "observability", "SLA"]
            }
        ],
        "scenario": [
            {
                "question": "Production is down and you need to restore service quickly. Walk through your approach.",
                "category": "Scenario",
                "ideal_answer": "Check monitoring dashboards, review recent deployments, check logs, identify root cause, implement rollback if needed, communicate with team, restore service, conduct post-mortem, implement preventive measures.",
                "keywords": ["incident", "monitoring", "rollback", "logs", "communication", "post-mortem", "recovery"]
            }
        ]
    },
    "Business Analyst": {
        "hr": [
            {
                "question": "What makes you a good Business Analyst?",
                "category": "HR",
                "ideal_answer": "Strong analytical skills, ability to bridge business and technical teams, experience gathering requirements, creating documentation, stakeholder management, problem-solving abilities.",
                "keywords": ["analytical", "requirements", "stakeholders", "documentation", "problem solving", "communication"]
            }
        ],
        "technical": [
            {
                "question": "How do you gather and document requirements?",
                "category": "Technical",
                "ideal_answer": "Conduct stakeholder interviews, workshops, surveys, analyze existing systems, create user stories, use cases, process flows, maintain requirements traceability matrix, validate with stakeholders.",
                "keywords": ["requirements", "interviews", "user stories", "documentation", "validation", "stakeholders"]
            },
            {
                "question": "Explain how you perform gap analysis.",
                "category": "Technical",
                "ideal_answer": "Understand current state, define desired future state, identify gaps between them, analyze root causes, prioritize gaps, recommend solutions, create implementation roadmap.",
                "keywords": ["gap analysis", "current state", "future state", "solutions", "roadmap", "prioritization"]
            }
        ],
        "scenario": [
            {
                "question": "Stakeholders have conflicting requirements. How do you resolve this?",
                "category": "Scenario",
                "ideal_answer": "Facilitate meetings to understand each perspective, identify common goals, analyze business impact, present data-driven recommendations, negotiate compromises, document decisions and rationale.",
                "keywords": ["conflict resolution", "facilitation", "negotiation", "compromise", "documentation", "alignment"]
            }
        ]
    }
}

def get_questions_for_role(role):
    """Get all questions for a specific role"""
    if role not in QUESTION_BANK:
        return []
    
    role_questions = QUESTION_BANK[role]
    questions = []
    
    for category in ["hr", "technical", "scenario"]:
        if category in role_questions:
            questions.extend(role_questions[category])
    
    return questions

def get_all_roles():
    """Get list of available roles"""
    return list(QUESTION_BANK.keys())
