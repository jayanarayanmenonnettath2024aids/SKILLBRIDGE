import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const JobFilter = ({ onFilter }) => {
    return (
        <Card className="filter-card p-4">
            <h4 className="mb-4 font-bold">Filters</h4>

            <div className="filter-group mb-4">
                <label className="block text-sm font-medium mb-2">Job Type</label>
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" /> Full Time
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" /> Part Time
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" /> Gig / Contract
                    </label>
                </div>
            </div>

            <div className="filter-group mb-4">
                <label className="block text-sm font-medium mb-2">Location</label>
                <select className="input-field text-sm p-2 w-full">
                    <option>All Locations</option>
                    <option>Bangalore</option>
                    <option>Chennai</option>
                    <option>Remote</option>
                </select>
            </div>

            <Button className="w-full">Apply Filters</Button>
        </Card>
    );
};

export default JobFilter;
