import React from "react";

const MarkdownGuideCard: React.FC = () => (
  <div className="rounded-lg shadow-sm text-center border-gray-900 border flex justify-center px-10 mx-auto my-5">
    <table className="table-auto border-collapse content-center flex-auto">
      <thead>
        <tr>
          <th className="py-2">..to Get</th>
          <th className="py-2">Type</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2">Bold</td>
          <td className="py-2">**Bold**</td>
        </tr>
        <tr>
          <td className="py-2">Italic</td>
          <td className="py-2">*Italic*</td>
        </tr>
        <tr>
          <td className="py-2">Blockquote</td>
          <td className="py-2"> {"> Blockquote"}</td>
        </tr>
        <tr>
          <td className="py-2">Link</td>
          <td className="py-2">{"[Link](Link address)"}</td>
        </tr>
        <tr>
          <td className="py-2">Image</td>
          <td className="py-2">{"![Alt](Image address)"}</td>
        </tr>
        <tr>
          <td className="py-2">Inline code</td>
          <td className="py-2">`Inline code`</td>
        </tr>
        <tr>
          <td className="py-2">Block code</td>
          <td className="py-2">
            <div>```</div>
            <div>Block code</div>
            <div>```</div>
          </td>
        </tr>
        <tr>
          <td className="py-2">Unordered List</td>
          <td className="py-2">
            <div> - item 1</div>
            <div> - item 2</div>
            <div> - item 3</div>
          </td>
        </tr>
        <tr>
          <td className="py-4">Ordered List</td>
          <td className="py-4">
            <div> 1. item 1</div>
            <div> 2. item 2</div>
            <div> 3. item 3</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default MarkdownGuideCard;
