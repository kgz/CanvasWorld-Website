export const genPath = (path: string) => {

    // }removespace and make sure a / is at the front
    path = path.replace(/\s/g, "");
    path = path.replace(/\/$/, "");
    path = "/" + path;
    return path;
}



