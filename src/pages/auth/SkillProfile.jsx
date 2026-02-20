import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Briefcase, Plus, X, Code, Wrench, ShoppingBag, Palette, TrendingUp, Users, Megaphone, Building2 } from 'lucide-react';

const SKILLS_BY_CATEGORY = {
    'Technology': {
        icon: Code,
        skills: ['Data Entry', 'MS Office', 'Excel', 'Web Development', 'Python Programming', 'Digital Marketing', 'Graphic Design', 'Video Editing']
    },
    'Technical & Trades': {
        icon: Wrench,
        skills: ['Electrician', 'Plumbing', 'Carpentry', 'Welding', 'AC Repair', 'Mobile Repair', 'Two Wheeler Mechanic', 'Auto Electrician']
    },
    'Retail & Sales': {
        icon: ShoppingBag,
        skills: ['Retail Sales', 'Customer Service', 'Cashier', 'Store Management', 'Inventory Management', 'Product Knowledge']
    },
    'Creative': {
        icon: Palette,
        skills: ['Tailoring', 'Fashion Design', 'Jewelry Making', 'Photography', 'Content Writing', 'Social Media Management']
    },
    'Service & Hospitality': {
        icon: Users,
        skills: ['Cooking', 'Housekeeping', 'Security Guard', 'Delivery Services', 'Driver', 'Waiter/Waitress']
    },
    'Business & Finance': {
        icon: TrendingUp,
        skills: ['Accounting', 'Bookkeeping', 'Tally', 'GST Filing', 'Banking Operations', 'Insurance Agent']
    }
};

const JOB_ROLES = [
    'Data Entry Operator',
    'Retail Associate',
    'Electrician',
    'Plumber',
    'Sales Executive',
    'Delivery Partner',
    'Customer Service Representative',
    'Waiter/Waitress',
    'Security Guard',
    'Driver',
    'Tailor',
    'Graphic Designer',
    'Content Writer',
    'Digital Marketing Executive',
    'Accountant',
    'Cashier',
    'Receptionist',
    'Cook/Chef',
    'Carpenter',
    'Mechanic',
    'Warehouse Associate',
    'Field Sales Executive'
];

const SkillProfile = ({ onNext, onBack }) => {
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedJobRoles, setSelectedJobRoles] = useState([]);
    const [education, setEducation] = useState('12th Pass');
    const [activeCategory, setActiveCategory] = useState('Technology');

    const toggleSkill = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const toggleJobRole = (role) => {
        if (selectedJobRoles.includes(role)) {
            setSelectedJobRoles(selectedJobRoles.filter(r => r !== role));
        } else {
            setSelectedJobRoles([...selectedJobRoles, role]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ education, skills: selectedSkills, jobRoles: selectedJobRoles });
    };

    return (
        <div className="onboarding-step-body fade-in">
            <div className="skill-profile-grid">
                {/* LEFT - Education & Categories */}
                <div className="selection-sidebar-left">
                    <Card className="onboarding-card-base" style={{ padding: '32px' }}>
                        <div className="form-group" style={{ marginBottom: '32px' }}>
                            <label className="input-label-premium">Highest Education</label>
                            <select
                                value={education}
                                onChange={(e) => setEducation(e.target.value)}
                                className="input-field-premium"
                            >
                                <option value="10th Pass">10th Pass</option>
                                <option value="12th Pass">12th Pass</option>
                                <option value="ITI / Diploma">ITI / Diploma</option>
                                <option value="Graduate">Graduate</option>
                                <option value="Post Graduate">Post Graduate</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="input-label-premium">Skill Categories</label>
                            <div className="category-stack" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {Object.keys(SKILLS_BY_CATEGORY).map(category => {
                                    const IconComponent = SKILLS_BY_CATEGORY[category].icon;
                                    const isActive = activeCategory === category;
                                    return (
                                        <button
                                            key={category}
                                            type="button"
                                            className={`onboarding-btn-text ${isActive ? 'active' : ''}`}
                                            style={{
                                                justifyContent: 'flex-start',
                                                padding: '12px 16px',
                                                borderRadius: '12px',
                                                background: isActive ? '#EEF2FF' : 'transparent',
                                                color: isActive ? '#4F46E5' : '#64748B',
                                                width: '100%',
                                                gap: '12px'
                                            }}
                                            onClick={() => setActiveCategory(category)}
                                        >
                                            <IconComponent size={18} />
                                            {category}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* RIGHT - Skills & Roles */}
                <div className="tags-content-right" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="skills-selection-section">
                        <label className="input-label-premium" style={{ marginBottom: '16px', display: 'block' }}>
                            Select Skills in {activeCategory}
                        </label>
                        <div className="scroll-pane-premium" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {SKILLS_BY_CATEGORY[activeCategory].skills.map(skill => (
                                <button
                                    key={skill}
                                    type="button"
                                    className={`skill-tag-clickable ${selectedSkills.includes(skill) ? 'active' : ''}`}
                                    onClick={() => toggleSkill(skill)}
                                >
                                    {skill}
                                    {selectedSkills.includes(skill) ? (
                                        <X size={14} style={{ marginLeft: '6px' }} />
                                    ) : (
                                        <Plus size={14} style={{ marginLeft: '6px' }} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="job-roles-section">
                        <label className="input-label-premium" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                            Preferred Roles <span>{selectedJobRoles.length}/5</span>
                        </label>
                        <div className="scroll-pane-premium" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', maxHeight: '240px' }}>
                            {JOB_ROLES.map(role => (
                                <button
                                    key={role}
                                    type="button"
                                    className={`skill-tag-clickable ${selectedJobRoles.includes(role) ? 'active' : ''}`}
                                    onClick={() => {
                                        if (selectedJobRoles.length < 5 || selectedJobRoles.includes(role)) {
                                            toggleJobRole(role);
                                        }
                                    }}
                                    style={{ opacity: selectedJobRoles.length >= 5 && !selectedJobRoles.includes(role) ? 0.5 : 1 }}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="onboarding-actions-row">
                <button onClick={onBack} className="onboarding-btn-text">
                    Back
                </button>
                <div style={{ flex: 1 }}></div>
                <button
                    onClick={handleSubmit}
                    disabled={selectedSkills.length === 0 || selectedJobRoles.length === 0}
                    className="onboarding-btn-primary"
                >
                    Continue to Uploads
                </button>
            </footer>
        </div>
    );
};

export default SkillProfile;
