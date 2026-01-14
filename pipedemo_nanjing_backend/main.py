def main():
    import uvicorn
    uvicorn.run("app.main:app",
                host="127.0.0.1",
                port=3000,
                log_level="info",
                access_log=True)


if __name__ == "__main__":
    main()
