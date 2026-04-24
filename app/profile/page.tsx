"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  User,
  Upload,
  Save,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
} from "lucide-react";
import { getCurrentUser, setCurrentUser, UserProfile, Document } from "@/lib/mockData";
import { parseResume } from "@/lib/aiService";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    category: 'General',
    age: '',
    location: '',
    skills: '',
    experience: '',
  });
  const [resumeText, setResumeText] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error("Please login to view profile");
      router.push("/login");
      return;
    }
    setUser(currentUser);
    setFormData({
      name: currentUser.name,
      education: currentUser.education,
      category: currentUser.category,
      age: currentUser.age.toString(),
      location: currentUser.location,
      skills: currentUser.skills.join(', '),
      experience: currentUser.experience,
    });
    setDocuments(currentUser.documents || []);
  }, [router]);

  const handleSave = () => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      name: formData.name,
      education: formData.education,
      category: formData.category,
      age: parseInt(formData.age) || 0,
      location: formData.location,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      experience: formData.experience,
    };
    setCurrentUser(updated);
    setUser(updated);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleResumeUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      toast.error("Please upload a PDF file");
      return;
    }

    // Mock PDF text extraction - in production, use PDF parser library
    const mockText = `Name: ${formData.name || 'User'}
Education: ${formData.education || 'Not specified'}
Experience: ${formData.experience || 'Not specified'}
Skills: ${formData.skills || 'Not specified'}
Location: ${formData.location || 'Not specified'}
${file.name.includes('developer') ? 'Skills: JavaScript, React, Node.js, Python' : ''}
${file.name.includes('nurse') ? 'Skills: Patient Care, Nursing, Medical Records' : ''}
${file.name.includes('teacher') ? 'Skills: Teaching, Curriculum Development, Communication' : ''}
${file.name.includes('manager') ? 'Skills: Management, Leadership, Project Management' : ''}`;

    setResumeText(mockText);
    const parsed = parseResume(mockText);

    toast.success("Resume parsed! AI extracted your skills and education.");

    if (parsed.skills.length > 0 && !formData.skills) {
      setFormData(prev => ({ ...prev, skills: parsed.skills.join(', ') }));
    }
    if (parsed.education !== 'Not detected' && !formData.education) {
      setFormData(prev => ({ ...prev, education: parsed.education }));
    }
    if (parsed.experience !== 'Not detected' && !formData.experience) {
      setFormData(prev => ({ ...prev, experience: parsed.experience }));
    }
  }, [formData]);

  const handleDocumentUpload = (type: string) => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      type,
      url: '#', // Mock URL
      status: 'pending',
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    const updated = [...documents, newDoc];
    setDocuments(updated);
    if (user) {
      const updatedUser = { ...user, documents: updated };
      setCurrentUser(updatedUser);
      setUser(updatedUser);
    }
    toast.success(`${type} uploaded! Status: Pending verification.`);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <User className="w-8 h-8 text-ugova-600" />
          My Profile
        </h1>
        <p className="text-slate-500 mt-1">Manage your information, resume, and documents</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-ugova-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-ugova-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
              <p className="text-slate-500">{user.email}</p>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                user.role === 'admin' ? 'bg-red-50 text-red-700' : 'bg-ugova-50 text-ugova-700'
              }`}>
                <Shield className="w-3 h-3" />
                {user.role === 'admin' ? 'Administrator' : 'User'}
              </span>
            </div>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="px-4 py-2 bg-ugova-600 text-white rounded-lg text-sm font-medium hover:bg-ugova-700 transition-colors flex items-center gap-2"
          >
            {isEditing ? <><Save className="w-4 h-4" /> Save</> : 'Edit Profile'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-ugova-500 focus:ring-2 focus:ring-ugova-200 outline-none"
              />
            ) : (
              <p className="text-slate-900 py-2">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Education</label>
            {isEditing ? (
              <select
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-ugova-500 focus:ring-2 focus:ring-ugova-200 outline-none"
              >
                <option value="">Select Education</option>
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
                <option value="Diploma">Diploma</option>
                <option value="B.A">B.A</option>
                <option value="B.Com">B.Com</option>
                <option value="B.Sc">B.Sc</option>
                <option value="B.Tech">B.Tech</option>
                <option value="BCA">BCA</option>
                <option value="B.Ed">B.Ed</option>
                <option value="B.Sc Nursing">B.Sc Nursing</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MBA">MBA</option>
                <option value="M.Sc">M.Sc</option>
                <option value="PhD">PhD</option>
              </select>
            ) : (
              <p className="text-slate-900 py-2">{user.education || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            {isEditing ? (
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-ugova-500 focus:ring-2 focus:ring-ugova-200 outline-none"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            ) : (
              <p className="text-slate-900 py-2">{user.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
            {isEditing ? (
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-ugova-500 focus:ring-2 focus:ring-ugova-200 outline-none"
                placeholder="Your age"
              />
            ) : (
              <p className="text-slate-900 py-2">{user.age || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-ugova-500 focus:ring-2 focus:ring-ugova-200 outline-none"
                placeholder="City, State"
              />
            ) : (
              <p className="text-slate-900 py-2">{user.location || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Experience</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-ugova-500 focus:ring-2 focus:ring-ugova-200 outline-none"
                placeholder="e.g., 2 years"
              />
            ) : (
              <p className="text-slate-900 py-2">{user.experience || 'Not set'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Skills (comma separated)</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-ugova-500 focus:ring-2 focus:ring-ugova-200 outline-none"
                placeholder="e.g., JavaScript, React, Node.js"
              />
            ) : (
              <div className="flex flex-wrap gap-2 py-2">
                {user.skills.length > 0 ? user.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-ugova-50 text-ugova-700 rounded-full text-sm">
                    {skill}
                  </span>
                )) : <p className="text-slate-400">No skills added</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resume Upload */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-ugova-600" />
          Resume Upload
        </h2>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-ugova-300 transition-colors">
          <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Upload your resume</p>
          <p className="text-sm text-slate-400 mt-1">AI will extract skills and education automatically</p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="mt-4 mx-auto block text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-ugova-50 file:text-ugova-700 hover:file:bg-ugova-100"
          />
        </div>
        {resumeText && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm font-medium text-slate-700 mb-2">AI Extracted Data:</p>
            <pre className="text-xs text-slate-600 whitespace-pre-wrap">{resumeText.substring(0, 300)}...</pre>
          </div>
        )}
      </div>

      {/* Document Verification */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-ugova-600" />
          Document Verification
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {['Aadhaar Card', 'PAN Card', 'Education Certificate'].map((docType) => (
            <div key={docType} className="border border-slate-200 rounded-xl p-4 text-center">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">{docType}</p>
              <button
                onClick={() => handleDocumentUpload(docType)}
                className="mt-3 px-3 py-1.5 bg-ugova-50 text-ugova-700 rounded-lg text-xs font-medium hover:bg-ugova-100 transition-colors"
              >
                Upload
              </button>
            </div>
          ))}
        </div>

        {/* Document List */}
        {documents.length > 0 && (
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Uploaded Documents</h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{doc.type}</p>
                      <p className="text-xs text-slate-400">Uploaded: {doc.uploadedAt}</p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                    doc.status === 'verified' ? 'bg-green-50 text-green-700' :
                    doc.status === 'rejected' ? 'bg-red-50 text-red-700' :
                    'bg-yellow-50 text-yellow-700'
                  }`}>
                    {doc.status === 'verified' && <CheckCircle className="w-3 h-3" />}
                    {doc.status === 'rejected' && <XCircle className="w-3 h-3" />}
                    {doc.status === 'pending' && <Clock className="w-3 h-3" />}
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
