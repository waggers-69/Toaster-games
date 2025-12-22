rm -rf export
cd docs
npm run build
cd ../site
cp -r ../docs/build/* ./public/docs
npm run export

cd ../
echo "Export complete."