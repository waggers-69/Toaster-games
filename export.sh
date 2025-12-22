rm -rf export
cd docs
npm run build
cd ../site
cp -r ../docs/build/* ./public/docs
npm run export

cd ../
echo "Export complete."
echo "Serving..."
cd export
npx serve -p 80