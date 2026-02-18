import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import MatchScore from '../../components/dashboard/MatchScore';
import { Search, Filter, MapPin, CheckCircle, Clock } from 'lucide-react';
import '../../styles/Employer.css';

const EmployerDashboard = () => {
    const [candidates] = useState([
        {
            id: 1,
            name: 'Rahul Kumar',
            role: 'Data Entry Operator',
            location: 'Bangalore',
            match: 95,
            verified: true,
            skills: ['Typing (40wpm)', 'Excel', 'English (Basic)'],
            status: 'New'
        },
        {
            id: 2,
            name: 'Priya Sharma',
            role: 'Customer Support',
            location: 'Remote',
            match: 88,
            verified: true,
            skills: ['Communication', 'CRM', 'Hindi', 'English'],
            status: 'Interviewed'
        },
        {
            id: 3,
            name: 'Amit Singh',
            role: 'Warehouse Associate',
            location: 'Mumbai',
            match: 72,
            verified: false,
            skills: ['Inventory', 'Physical Fitness'],
            status: 'Screening'
        }
    ]);

    return (
        <div className="container employer-page">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Employer Portal</h1>
                    <p className="text-secondary">Find and hire verified rural talent.</p>
                </div>
                <Button>Post a Job</Button>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="p-4 bg-white border-l-4 border-primary">
                    <h3 className="text-2xl font-bold">12</h3>
                    <p className="text-sm text-secondary">Active Jobs</p>
                </Card>
                <Card className="p-4 bg-white border-l-4 border-accent">
                    <h3 className="text-2xl font-bold">45</h3>
                    <p className="text-sm text-secondary">New Applications</p>
                </Card>
                <Card className="p-4 bg-white border-l-4 border-success">
                    <h3 className="text-2xl font-bold">8</h3>
                    <p className="text-sm text-secondary">Interviews Today</p>
                </Card>
            </div>

            {/* Candidate Search */}
            <Card className="mb-8 p-6">
                <h3 className="text-lg font-bold mb-4">Search Candidates</h3>
                <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 relative min-w-[300px]">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by skill, role, or location..."
                            className="input-field pl-10"
                        />
                    </div>
                    <Button variant="outline"><Filter size={18} className="mr-2" /> Filters</Button>
                    <Button>Search</Button>
                </div>
                <div className="mt-4 flex gap-2">
                    <Badge variant="neutral">Verified Only <CheckCircle size={12} className="ml-1 inline" /></Badge>
                    <Badge variant="neutral">Bangalore</Badge>
                    <Badge variant="neutral">Data Entry</Badge>
                </div>
            </Card>

            {/* Candidate List */}
            <div>
                <h3 className="text-lg font-bold mb-4">Recent Applicants</h3>
                <div className="flex flex-col gap-4">
                    {candidates.map(candidate => (
                        <Card key={candidate.id} className="candidate-card flex flex-col md:flex-row gap-4 p-4 items-center">
                            <div className="flex-shrink-0">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${candidate.name.replace(' ', '+')}&background=random`}
                                    alt={candidate.name}
                                    className="w-16 h-16 rounded-full"
                                />
                            </div>
                            <div className="flex-grow text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <h4 className="font-bold text-lg">{candidate.name}</h4>
                                    {candidate.verified && <CheckCircle size={16} className="text-success" title="Identity Verified" />}
                                </div>
                                <p className="text-primary font-medium">{candidate.role}</p>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-secondary mt-1">
                                    <MapPin size={14} /> {candidate.location}
                                </div>
                                <div className="flex gap-2 mt-2 justify-center md:justify-start flex-wrap">
                                    {candidate.skills.map(skill => (
                                        <span key={skill} className="text-xs bg-gray-100 px-2 py-1 rounded">{skill}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2 min-w-[100px]">
                                <MatchScore score={candidate.match} size={50} strokeWidth={5} />
                                <span className="text-xs font-bold text-secondary">Match</span>
                            </div>
                            <div className="flex flex-col gap-2 min-w-[140px]">
                                <Button size="sm">Schedule Interview</Button>
                                <Button variant="outline" size="sm">View Profile</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
