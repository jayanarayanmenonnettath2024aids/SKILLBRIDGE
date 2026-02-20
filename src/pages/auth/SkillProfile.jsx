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
        <div className="onboarding-step fade-in">
            <div className="step-header">
                <div className="icon-bg bg-amber-100 text-accent">
                    <Briefcase size={32} />
                </div>
                <h2>Build Your Profile</h2>
                <p>Tell us about your education, skills and preferred job roles.</p>
            </div>

            <Card className="onboarding-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Education Level</label>
                        <select
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            className="input-field"
                        >
                            <option value="10th Pass">10th Pass</option>
                            <option value="12th Pass">12th Pass</option>
                            <option value="ITI / Diploma">ITI / Diploma</option>
                            <option value="Graduate">Graduate</option>
                            <option value="Post Graduate">Post Graduate</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Select Your Skills</label>
                        
                        {/* Category Tabs */}
                        <div className="category-tabs">
                            {Object.keys(SKILLS_BY_CATEGORY).map(category => {
                                const IconComponent = SKILLS_BY_CATEGORY[category].icon;
                                return (
                                    <button
                                        key={category}
                                        type="button"
                                        className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(category)}
                                    >
                                        <IconComponent size={16} />
                                        {category}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Skills Grid */}
                        <div className="skills-grid">
                            {SKILLS_BY_CATEGORY[activeCategory].skills.map(skill => (
                                <div
                                    key={skill}
                                    className={`skill-chip ${selectedSkills.includes(skill) ? 'active' : ''}`}
                                    onClick={() => toggleSkill(skill)}
                                >
                                    {skill}
                                    {selectedSkills.includes(skill) ? <X size={14} /> : <Plus size={14} />}
                                </div>
                            ))}
                        </div>

                        {/* Selected Skills Summary */}
                        {selectedSkills.length > 0 && (
                            <div className="selected-skills-summary">
                                <span className="summary-label">Selected Skills ({selectedSkills.length}):</span>
                                <div className="selected-skills-list">
                                    {selectedSkills.map(skill => (
                                        <Badge key={skill} variant="primary">
                                            {skill}
                                            <X 
                                                size={12} 
                                                style={{ marginLeft: '4px', cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSkill(skill);
                                                }}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Preferred Job Roles (Select up to 5)</label>
                        <div className="job-roles-grid">
                            {JOB_ROLES.map(role => (
                                <div
                                    key={role}
                                    className={`skill-chip ${selectedJobRoles.includes(role) ? 'active' : ''}`}
                                    onClick={() => {
                                        if (selectedJobRoles.length < 5 || selectedJobRoles.includes(role)) {
                                            toggleJobRole(role);
                                        }
                                    }}
                                    style={{ opacity: selectedJobRoles.length >= 5 && !selectedJobRoles.includes(role) ? 0.5 : 1 }}
                                >
                                    {role}
                                    {selectedJobRoles.includes(role) ? <X size={14} /> : <Plus size={14} />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="actions-row">
                        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
                        <Button type="submit" disabled={selectedSkills.length === 0 || selectedJobRoles.length === 0}>
                            Next
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default SkillProfile;
