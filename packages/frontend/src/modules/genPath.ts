export const genPath = (path: string) => {
    // Remove spaces and make lowercase
    path = path.replace(/\s/g, "_");
    path = path.replace(/\/$/, "");
    path = path.toLowerCase();
    return path;
}



