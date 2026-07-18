const mongooseToObject = (mongooseDocument) => {
  if (!mongooseDocument) {
    return null;
  }

  const plainObject = {
    ...mongooseDocument,
    id: mongooseDocument._id.toString(), // Thêm trường id từ _id của MongoDB
  };
  delete plainObject._id; // Xóa trường _id gốc

  return plainObject;
};

const mongooseToObjects = (mongooseDocuments) => {
  if (!mongooseDocuments || !Array.isArray(mongooseDocuments)) {
    return [];
  }

  return mongooseDocuments.map((doc) => mongooseToObject(doc));
};

export { mongooseToObject, mongooseToObjects };
