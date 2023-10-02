export const classifyFiles = (fileName) => {
    const extension = fileName.split('.')[1];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    const videoExtensions = ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'mpeg'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'];
    if (imageExtensions.includes(extension)) return 1;
    else if (videoExtensions.includes(extension)) return 2;
    else if (documentExtensions.includes(extension)) return 3;
    else return 4;
}