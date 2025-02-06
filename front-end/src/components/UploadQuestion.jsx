import { useState } from "react";
import axios from "axios";
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';


const QuestionForm=()=>{
    const [options, setOptions] = useState(['', '', '', '']);
    const [formData, setFormData] = useState({
        subject: '',
        topic: '',
        questionText: '',
        correctAnswer: '',
    });
    const Subjects = [
        { id: 1, name: 'Mathematics' },
        { id: 2, name: 'Physics' },
        { id: 3, name: 'Chemistry' },
        { id: 4, name: 'Biology' },
    ]
    const [selectedSubjected, setSelectedSubject] = useState(Subjects[0])
    const [questionCounts, setQuestionCounts] = useState({
        Mathematics: 0,
        Physics: 0,
        Chemistry: 0,
        Biology: 0
    });
    
    // Add preview states
    const [previewMode, setPreviewMode] = useState(false);
    
    const handleChange=(e)=>{
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name] : value,
        })
    }
    const handleOptionsChange = (e, index) => {
        const newOptions = [...options];
        newOptions[index] = e.target.value;
        setOptions(newOptions);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate that correctAnswer corresponds to an actual option
            const optionsArray = options.filter(opt => opt.trim() !== '');
            const correctAnswerIndex = parseInt(formData.correctAnswer) - 1;
            
            if (correctAnswerIndex < 0 || correctAnswerIndex >= optionsArray.length) {
                alert('Please enter a valid correct answer number corresponding to an option');
                return;
            }

            const finalFormData = {
                subject: selectedSubjected.name,
                topic: formData.topic.trim() || undefined, // Only send if not empty
                questionText: formData.questionText.trim(),
                options: optionsArray,
                correctAnswer: correctAnswerIndex
            };

            const token = localStorage.getItem('token')
            // console.log('question',token)
            const response = await axios.post('http://localhost:3000/admin/createQuestion', finalFormData,{
                headers: {
                    Authorization : `Bearer ${token}`
                }
            });
            
            // Update count for the selected subject
            setQuestionCounts(prev => ({
                ...prev,
                [selectedSubjected.name]: prev[selectedSubjected.name] + 1
            }));

            // Reset form
            setFormData({
                subject: '',
                topic: '',
                questionText: '',
                correctAnswer: '',
            });
            setOptions(['', '', '', '']);
            setSelectedSubject(Subjects[0]);
            
        } catch (error) {
            console.error('Error submitting question:', error.response?.data?.message || error.message);
            alert('Error saving question: ' + (error.response?.data?.message || error.message));
        }
    }

    // Add preview component
    const MathPreview = ({ text }) => {
        try {
            return <TeX math={text} />;
        } catch (error) {
            return <span className="text-red-500">Invalid LaTeX syntax</span>;
        }
    };

    return (
        <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-violet-200 to-pink-200">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-8 font-robert-regular">
                    Upload Questions to Database
                </h2>

                {/* Add Question Counter Display */}
                <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(questionCounts).map(([subject, count]) => (
                        <div 
                            key={subject} 
                            className={`bg-white p-4 rounded-lg shadow ${
                                selectedSubjected.name === subject ? 'ring-2 ring-indigo-600' : ''
                            }`}
                        >
                            <h3 className="text-sm font-medium text-gray-500">{subject}</h3>
                            <p className="mt-2 text-3xl font-semibold text-indigo-600">{count}</p>
                            <p className="text-xs text-gray-500">questions submitted</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <label className="block text-sm font-medium text-gray-900 sm:w-1/4">
                                Subject
                            </label>
                            <div className="max-w-screen-md sm:w-3/4">
                                <select 
                                    name="subject" 
                                    id={Subjects.id}
                                    value={selectedSubjected.name}
                                    onChange={(e) => {
                                        const subject = Subjects.find(s => s.name === e.target.value);
                                        setSelectedSubject(subject);
                                    }}
                                    className="rounded-lg p-2 border-2 border-gray-300 cursor-pointer hover:border-indigo-500 drop-shadow-md"
                                >
                                    {Subjects.map((item) => (
                                        <option 
                                            key={item.id}
                                            id={item.id}
                                        >
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <label className="block text-sm font-medium text-gray-900 sm:w-1/4">
                                Topic (Optional)
                            </label>
                            <input
                                type="text"
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Question Text (Supports LaTeX: Use $ for inline math, $$ for display math)
                                </label>
                                <div className="space-y-2">
                                    <textarea
                                        name="questionText"
                                        rows="3"
                                        required
                                        value={formData.questionText}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="Enter question text (e.g., Find the value of $\sqrt{16} + \frac{1}{2}$)"
                                    />
                                    {formData.questionText && (
                                        <div className="p-4 bg-gray-50 rounded-md">
                                            <div className="text-sm text-gray-700 font-medium mb-1">Preview:</div>
                                            <MathPreview text={formData.questionText} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {options.map((option, index) => (
                                    <div key={index}>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Option {index + 1}
                                        </label>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                required
                                                value={option}
                                                onChange={(e) => handleOptionsChange(e, index)}
                                                className="input-field"
                                                placeholder="Enter option (e.g., $2\pi r^2$)"
                                            />
                                            {option && (
                                                <div className="p-2 bg-gray-50 rounded-md">
                                                    <MathPreview text={option} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="sm:w-1/3">
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Correct Answer (1-4)
                                </label>
                                <input
                                    type="number"
                                    name="correctAnswer"
                                    min="1"
                                    max="4"
                                    required
                                    value={formData.correctAnswer}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                className="rounded-md cursor-pointer bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Save Question
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default QuestionForm