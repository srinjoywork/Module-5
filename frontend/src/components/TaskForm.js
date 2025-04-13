import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function TaskForm({ token, task, onClose, onSave }) {
  const formik = useFormik({
    initialValues: {
      title: '',
      subject: '',
      priority: '',
      completed: false,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .required('Title is required'),
      subject: Yup.string()
        .min(3, 'Subject must be at least 3 characters')
        .required('Subject is required'),
      priority: Yup.number()
        .typeError('Priority must be a number')
        .moreThan(0, 'Priority must be greater than 0')
        .required('Priority is required'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const url = task
        ? `https://module-5-u7b1.onrender.com/task/${task._id}`
        : 'https://module-5-u7b1.onrender.com/task';
      const method = task ? 'PUT' : 'POST';

      try {
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Could not save the task');
        }

        onSave();
        onClose();
      } catch (err) {
        setErrors({ submit: err.message });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (task) {
      formik.setValues({
        title: task.title || '',
        subject: task.subject || '',
        priority: task.priority || '',
        completed: task.completed || false,
      });
    }
  }, [task]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {task ? 'Edit Task' : 'Add Task'}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
            )}
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.subject && formik.errors.subject && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.subject}</p>
            )}
          </div>

          {/* Priority Field */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
            <input
              id="priority"
              name="priority"
              type="number"
              min="1"
              value={formik.values.priority}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.priority && formik.errors.priority && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.priority}</p>
            )}
          </div>

          {/* Completed Status */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Status:</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="completed"
                checked={formik.values.completed}
                onChange={formik.handleChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-sm">
                {formik.values.completed ? 'Completed' : 'Incomplete'}
              </span>
            </label>
          </div>

          {/* Submit / Close */}
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              {task ? 'Edit' : 'Add'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Close
            </button>
          </div>

          {/* Submission Error */}
          {formik.errors.submit && (
            <p className="text-red-500 text-center text-sm mt-4">{formik.errors.submit}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
