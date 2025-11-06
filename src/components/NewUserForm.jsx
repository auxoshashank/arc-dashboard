import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

const NewUserForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* User Name */}
      <div>
        <label className="block text-sm font-medium text-gray-600">User Name</label>
        <Input
          name="userName"
          type="text"
          placeholder="Enter here"
          value={formData.userName}
          onChange={handleChange}
          required
        />
      </div>

      {/* User Email */}
      <div>
        <label className="block text-sm font-medium text-gray-600">User Email ID</label>
        <Input
          name="email"
          type="email"
          placeholder="Enter here"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Role</label>
        <Select onValueChange={handleSelectChange}>
          <SelectItem value="Project Owner">Project Owner</SelectItem>
          <SelectItem value="Contributor">Contributor</SelectItem>
          <SelectItem value="Application User">Application User</SelectItem>
        </Select>
      </div>

      <button type="submit" className="hidden">Submit</button>
    </form>
  );
};

export default NewUserForm;
