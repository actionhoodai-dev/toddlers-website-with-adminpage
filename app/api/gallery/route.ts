import { NextResponse } from "next/server";

// GitHub Config
const OWNER = process.env.GITHUB_OWNER || "actionhoodai-dev";
const REPO = process.env.GITHUB_REPO || "toddlers-website-with-adminpage";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const TOKEN = process.env.GITHUB_TOKEN;

// Helper to make GitHub API requests
async function githubRequest(path: string, options: RequestInit = {}) {
  if (!TOKEN) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  const headers = {
    "Authorization": `token ${TOKEN}`,
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  return response;
}

// Helper to commit file
async function commitFile(path: string, content: string | Buffer, message: string, sha?: string) {
  const method = "PUT";
  const body: any = {
    message,
    content: Buffer.isBuffer(content) ? content.toString("base64") : Buffer.from(content).toString("base64"),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await githubRequest(path, {
    method,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`GitHub Commit Failed: ${err.message}`);
  }
  return res.json();
}

// Helper to delete file
async function deleteFile(path: string, sha: string, message: string) {
  const res = await githubRequest(path, {
    method: "DELETE",
    body: JSON.stringify({
      message,
      sha,
      branch: BRANCH
    })
  });
  if (!res.ok) {
    throw new Error("GitHub Delete Failed");
  }
}

// POST: Upload File to GitHub -> Return URL
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}-${safeName}`;
    const relativePath = `/uploads/${category}/${filename}`;
    const filePath = `public${relativePath}`;

    // 1. Commit Image to GitHub
    await commitFile(filePath, buffer, `Add gallery image: ${filename}`);

    // 2. Return the relative path (src) so Client can save to Firestore
    return NextResponse.json({
      success: true,
      src: relativePath,
      fileName: filename
    });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}

// DELETE: Remove File from GitHub
export async function DELETE(request: Request) {
  try {
    const { src } = await request.json(); // Expects /uploads/category/filename.ext

    if (!src) return NextResponse.json({ error: "No file path provided" }, { status: 400 });

    const filePath = `public${src}`;

    // Get file SHA to delete
    const fileRes = await githubRequest(`${filePath}?ref=${BRANCH}`);
    if (fileRes.ok) {
      const fileData = await fileRes.json();
      await deleteFile(filePath, fileData.sha, `Delete gallery image: ${path.basename(filePath)}`);
      return NextResponse.json({ success: true });
    } else {
      // If file not found on GitHub, maybe already deleted, return success to allow Firestore cleanup
      return NextResponse.json({ success: true, message: "File not found on GitHub, skipping." });
    }

  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
  }
}

// NOTE: No GET or PUT here. Metadata is handled locally by Firestore Client SDK.
