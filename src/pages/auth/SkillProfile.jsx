import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Briefcase, Plus, X } from 'lucide-react';

const SUGGESTED_SKILLS = [
    'Data Entry', 'Electrician', 'Plumbing', 'Sales', 'Driving', 'Tailoring', 'Retail', 'Carpentry'
];

const SkillProfile = ({ onNext, onBack }) => {
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [education, setEducation] = useState('12th Pass');

    const toggleSkill = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ education, skills: selectedSkills });
    };

    return (
        <div className="onboarding-step fade-in">
            <div className="step-header">
                <div className="icon-bg bg-amber-100 text-accent">
                    <Briefcase size={32} />
                </div>
                <h2>Build Your Profile</h2>
                <p>Tell us about your education and skills to get matched.</p>
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
                        <div className="skills-grid">
                            {SUGGESTED_SKILLS.map(skill => (
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
                    </div>

                    <div className="actions-row">
                        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
                        <Button type="submit" disabled={selectedSkills.length === 0}>Next</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default SkillProfile;
