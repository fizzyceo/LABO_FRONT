@@ .. @@
// Mongoose Schemas
const algorithmSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
-    code: String,
-    language: String,
-    complexity: String,
-    tags: [String],
+    parameters: [{
+      name: String,
+      label: String,
+      subParameters: [{
+        param: String,
+        config: {
+          type: { type: String, enum: ['range', 'exact', 'contains', 'boolean', 'list', 'date'] },
+          min: Number,
+          max: Number,
+          value: mongoose.Schema.Types.Mixed,
+          options: [String],
+          required: Boolean,
+          unit: String
+        }
+      }]
+    }],
+    action: { type: String, enum: ['validate', 'expert', 'conditional'], default: 'validate' },
+    globalParameters: [{
+      name: String,
+      value: mongoose.Schema.Types.Mixed
+    }],
     created: { type: Date, default: Date.now },
     lastModified: { type: Date, default: Date.now },
   },
   {
     timestamps: true,
     toJSON: {
       transform: function (doc, ret) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
         return ret;
       },
     },
   }
 );