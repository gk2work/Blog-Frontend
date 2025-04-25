import React, { useState } from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import html2pdf from "html2pdf.js";
import "../BlogList.css";



const BlogList = ({ blogs, onDelete }) => {
  const [loadingId, setLoadingId] = useState(null); // For showing loading state per blog
  const [summary, setSummary] = useState();
  const [summaries, setSummaries] = useState({});
  


  const handleDownloadPDF = (blog) => {
    const element = document.createElement("div");
    element.innerHTML = `
            <h3>AI Generated Blog</h3>
            <p><strong>Keywords:</strong> ${blog.keywords.join(", ")}</p>
            ${blog.content
              .split("\n\n")
              .map((p) => `<p>${p}</p>`)
              .join("")}
        `;

    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: `blog-${blog._id}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  const handleDownloadDOCX = async (blog) => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "AI Generated Blog",
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph(""),
            new Paragraph(`Keywords: ${blog.keywords.join(", ")}`),
            ...blog.content.split("\n\n").map((p) => new Paragraph(p)),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `blog-${blog._id}.docx`);
  };

//   const handleGenerateSummary = async (blogId) => {
//     setLoadingId(blogId);
//     const reqData = {
//         blogId: blogId,
//         summary: summary
//     }
//     try {
//       const res = await fetch(
//         "http://localhost:5000/api/blogs/generate-summary",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(reqData),
//         }
//       );

//       const data = await res.json();
//       console.log(data);
//       setSummary(data.content);

//       alert("AI Summary Blog generated!");
//       // You can optionally reload the blog list or pass data to parent
//       // e.g., onBlogGenerated(data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to generate summary blog");
//     } finally {
//       setLoadingId(null);
//     }
//   };

const handleGenerateSummary = async (blogId) => {
    setLoadingId(blogId);
    try {
      const res = await fetch("http://localhost:5000/api/blogs/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId }),
      });
  
      const data = await res.json();
      console.log(data);
  
      // Store summary only for the current blog
      setSummaries((prev) => ({
        ...prev,
        [blogId]: data.content,
      }));
  
      alert("AI Summary Blog generated!");
    } catch (err) {
      console.error(err);
      alert("Failed to generate summary blog");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCopyToClipboard = (blog) => {
    const fullText = `Keywords: ${blog.keywords.join(', ')}\n\n${blog.content}`;
    navigator.clipboard.writeText(fullText)
        .then(() => {
            alert('Blog copied to clipboard!');
        })
        .catch((err) => {
            console.error('Failed to copy:', err);
            alert('Failed to copy blog');
        });
};

  return (
    <div className="blog-container">
      <h2 className="blog-heading">Generated Blogs</h2>
      {blogs.length === 0 ? (
        <p className="blog-empty">No blogs yet.</p>
      ) : (
        blogs.map((blog, idx) => (
          <div key={idx} className="blog-card">
            <div className="blog-buttons">
              <button
                onClick={() => handleDownloadPDF(blog)}
                className="btn green"
              >
                PDF
              </button>
              <button
                onClick={() => handleDownloadDOCX(blog)}
                className="btn orange"
              >
                DOC
              </button>
              <button onClick={() => onDelete(blog._id)} className="btn red">
                Delete
              </button>
              <button
                onClick={() => handleGenerateSummary(blog._id)}
                className="btn blue"
                disabled={loadingId === blog._id}
              >
                {loadingId === blog._id ? "Summarizing..." : "AI Summary"}
              </button>

               <button
                                onClick={() => handleCopyToClipboard(blog)}
                                className="btn grey"
                            >
                                Copy
                            </button>
            </div>
            <p>
              <strong>Keywords:</strong> {blog.keywords.join(", ")}
            </p>

            {summary ? (
              <div>
                <p>My Summary</p>
                {summary}
                
              </div>
            ) : null}
            {blog.content.split("\n\n").map((para, i) => (
              <p key={i} className="blog-paragraph">
                {para}
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default BlogList;




