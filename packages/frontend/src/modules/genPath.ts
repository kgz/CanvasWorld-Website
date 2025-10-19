export const genPath = (path: string) => {

    // }removespace and make sure a / is at the front
    path = path.replace(/\s/g, "_");
    path = path.replace(/\/$/, "");
    path = "/" + path.toLowerCase();
    return path;
}



