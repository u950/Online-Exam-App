import React, { useState } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

// add subjects logic

const SetTest = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading]= useState(false);
    const [testData, setTestData] = useState({
        examType: '',
        title: '',
        description: '',
        totalMarks: '',
        totalTime: '',
        subjects: [] // Will contain {name: string, questions: string[]} objects
    });

    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [currentSubject, setCurrentSubject] = useState(null);


    const examTypes = ['JEE', 'NEET'];
    const subjects = [
        { id: 1, name: 'Mathematics' },
        { id: 2, name: 'Physics' },
        { id: 3, name: 'Chemistry' },
        { id: 4, name: 'Biology' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTestData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchQuestions = async (subject) => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/admin/getquestion');
            const filtered = response.data.questions.filter(q => q.subject === subject);
            setQuestions(filtered);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
        setLoading(false);
    };

    const handleSubjectClick = (subject) => {
        setCurrentSubject(subject);
        fetchQuestions(subject.name);
        setShowQuestionModal(true);
    };

    const handleQuestionSelection = (questionId) => {
        setTestData(prev => {
            const currentSubjectName = currentSubject.name;
            
            // Find if subject already exists in subjects array
            const subjectIndex = prev.subjects.findIndex(s => s.name === currentSubjectName);
            
            if (subjectIndex === -1) {
                // Add new subject with question
                return {
                    ...prev,
                    subjects: [...prev.subjects, {
                        name: currentSubjectName,
                        questions: [questionId]
                    }]
                };
            } else {
                // Update existing subject's questions
                const updatedSubjects = [...prev.subjects];
                const existingQuestions = updatedSubjects[subjectIndex].questions;
                
                // Toggle question selection
                if (existingQuestions.includes(questionId)) {
                    updatedSubjects[subjectIndex].questions = existingQuestions.filter(id => id !== questionId);
                    // Remove subject if no questions selected
                    if (updatedSubjects[subjectIndex].questions.length === 0) {
                        updatedSubjects.splice(subjectIndex, 1);
                    }
                } else {
                    updatedSubjects[subjectIndex].questions.push(questionId);
                }
                
                return {
                    ...prev,
                    subjects: updatedSubjects
                };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3000/admin/createTest', testData);
            alert('Test created successfully!');
            // Reset form
            setTestData({
                examType: '',
                title: '',
                description: '',
                totalMarks: '',
                totalTime: '',
                subjects: []
            });
            setShowQuestionModal(false);
        } catch (error) {
            alert('Error creating test: ' + error.message);
        }
    };

    // Modified QuestionModal to show selection status based on testData
    const QuestionModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Select Questions - {currentSubject?.name}</h3>
                    <button 
                        onClick={() => setShowQuestionModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                
                {loading ? (
                    <div>Loading questions...</div>
                ) : (
                    <div className="space-y-4">
                        {questions.map(question => {
                            const isSelected = testData.subjects
                                .find(s => s.name === currentSubject.name)
                                ?.questions.includes(question._id);
                            
                            return (
                                <div 
                                    key={question._id}
                                    className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                                        isSelected ? 'bg-green-50 border-green-500' : ''
                                    }`}
                                    onClick={() => handleQuestionSelection(question._id)}
                                >
                                    <div className="flex justify-between items-center">
                                        <TeX math={question.questionText} />
                                        {isSelected && (
                                            <span className="text-green-600 text-xl">✓</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="mt-5 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Create Test
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl p-7 bg-white border border-gray-300 rounded-xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={testData.title}
                            onChange={handleChange}
                            className="input-field"
                            required
                            placeholder='Full Syllabus Test 1'
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                        <input
                            name="description"
                            value={testData.description}
                            onChange={handleChange}
                            className="input-field"
                            rows="3"
                            required
                            placeholder='Mock tests series'
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Exam Type</label>
                        <select
                            name="examType"
                            value={testData.examType}
                            onChange={handleChange}
                            className="input-field"
                            required
                        >
                            <option value="">Select Exam Type</option>
                            {examTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Total Marks</label>
                            <input
                                type="number"
                                name="totalMarks"
                                value={testData.totalMarks}
                                onChange={handleChange}
                                className="input-field"
                                required
                                placeholder='total 300 or..'
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Total Time (minutes)</label>
                            <input
                                type="number"
                                name="totalTime"
                                value={testData.totalTime}
                                onChange={handleChange}
                                className="input-field"
                                required
                                placeholder='180 min.'
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900">
                            Select Subjects and Questions
                        </label>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                            {subjects.map(subject => (
                                <button
                                    key={subject.id}
                                    type="button"
                                    onClick={() => handleSubjectClick(subject)}
                                    className="p-4 border rounded-lg hover:bg-gray-50"
                                >
                                    {subject.name}
                                    {testData.subjects.find(s => s.name === subject.name)?.questions.length > 0 && (
                                        <span className="ml-2 text-green-600">
                                            ({testData.subjects.find(s => s.name === subject.name).questions.length} selected)
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Create Test
                    </button>
                </form>
            </div>

            {showQuestionModal && <QuestionModal />}
        </div>
    );
}

export default SetTest
