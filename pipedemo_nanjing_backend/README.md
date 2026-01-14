#dev
pip install uv
uv sync
uv run main.py

#build
uv run pyinstaller --noconfirm --onefile --console --distpath "." "main.py"
