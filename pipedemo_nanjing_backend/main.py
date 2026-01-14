from app.main import app


def main():
    import uvicorn
    uvicorn.run(app,
                host="127.0.0.1",
                port=3000,
                log_config=None,
                use_colors=False,
                access_log=True)


if __name__ == "__main__":
    main()
