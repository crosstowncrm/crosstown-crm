import React, { useRef } from "react";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./tools";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import multiStep from "../../../multiStep/multiStep";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const defaultData = {
  blocks: [
    {
      type: "header",
      data: {
        text: "headline",
        level: 2,
        config: {
          placeholder: "Enter a headline",
          defaultLevel: 3,
        },
      },
    },
    {
      type: "paragraph",
      inlineToolbar: true,
      data: {
        text: "summary or description",
        level: 2,
      },
    },
    {
      type: "paragraph",
      inlineToolbar: true,
      data: {
        text: "excerpt",
        level: 2,
      },
    },
    {
      type: "paragraph",
      inlineToolbar: true,
      data: {
        text: "link to original source",
        level: 2,
      },
    },
    {
      type: "paragraph",
      inlineToolbar: true,
      data: {
        text: "excerpt",
        level: 2,
      },
    },
    {
      type: "paragraph",
      inlineToolbar: true,
      data: {
        text: "tags",
        level: 2,
      },
    },
    {
      type: "paragraph",
      inlineToolbar: true,
      data: {
        text: "date",
        level: 2,
      },
    },
    {
      type: "paragraph",
      inlineToolbar: true,
      data: {
        text: "date of publication",
        level: 2,
      },
    },
    {
      type: "paragraph",
      inlineToolbar: true,
      data: {
        text: "blog-post date",
        level: 2,
      },
    },
    {
      type: "paragraph",
      inlineToolbar: true,
      data: {
        text: "author",
        level: 2,
      },
    },
    {
      type: "paragraph",
      inlineToolbar: true,
      data: {
        text: "location",
        level: 2,
      },
    },
    {
      type: "paragraph",
      inlineToolbar: true,
      data: {
        text: "front",
        level: 2,
      },
    },
    {
      type: "paragraph",
      inlineToolbar: true,
      data: {
        text: "email newsletters",
        level: 2,
      },
    },
    {
      type: "delimiter",
      data: {},
    },
  ],
};

function ArticleData() {
  const [errors, setErrors] = React.useState(multiStep.getErrors());

  const instanceRef = useRef(null);

  async function handleSave() {
    const savedData = await instanceRef.current.save();
    multiStep.saveData({
      data: savedData.blocks,
    });
  }

  const data =
    Object.keys(multiStep.getData()).length > 0
      ? { blocks: multiStep.getData() }
      : defaultData;
  return (
    <div>
      <div className="container">
        <EditorJs
          data={data}
          tools={EDITOR_JS_TOOLS}
          onChange={handleSave}
          instanceRef={(instance) => (instanceRef.current = instance)}
        />
      </div>
      <Link variant="body2" color="primary" to="/articles">
        <Button color="primary" type="button">
          Back to Articles
        </Button>
      </Link>
    </div>
  );
}

export default ArticleData;
