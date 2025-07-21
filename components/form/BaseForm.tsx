"use client";

import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import React from "react";

interface BaseFormProps {
  fields: {
    id: string;
    label: string;
    type: "text" | "number" | "textarea" | "select";
    value: string | number;
    onChange: (val: any) => void;
    options?: { label: string; value: string }[];
    required?: boolean;
  }[];
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  isFooter?: boolean;
}

const BaseForm: React.FC<BaseFormProps> = ({ fields, onSubmit, isSubmitting, submitLabel, isFooter }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      {fields.map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className="block text-sm font-medium text-white mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>

          {field.type === "textarea" ? (
            <Textarea
              id={field.id}
              value={field.value.toString()}
              onChange={(e) => field.onChange(e.target.value)}
              rows={3}
            />
          ) : field.type === "select" ? (
            <select
              id={field.id}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            >
              <option value="">-- Chọn --</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <Input
              id={field.id}
              type={field.type}
              value={field.value.toString()}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        </div>
      ))}

      <div className="flex justify-end pt-4">
        { <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-900 text-white"
        >
          {isSubmitting ? "Đang xử lý..." : submitLabel}
        </Button>}
      </div>
    </form>
  );
};

export default BaseForm;